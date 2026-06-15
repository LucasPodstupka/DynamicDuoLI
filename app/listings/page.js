"use client";
import { useEffect } from "react";

const MARKUP = `<header class="topbar" id="topbar">
  <div class="topbar-inner">
    <a class="brand" href="/" style="text-decoration:none;color:inherit">
      <span class="brand-logo"><img src="/logo.png" alt="Dynamic Duo LI"></span>
      <span class="brand-txt"><b>Dynamic Duo LI</b><span>Long Island Real Estate</span></span>
    </a>
    <nav class="topnav">
      <a href="/">Home</a>
      <a href="/#selector" class="topcta-link">Work With Us</a>
    </nav>
  </div>
</header>

<section class="listings listings-page" id="listings">
  <div class="wrap">
    <div class="listings-head reveal">
      <span class="eyebrow">Our Listings</span>
      <h2 class="listings-title">Homes we're representing.</h2>
      <p class="listings-sub">Browse active, pending, and sold homes from our team. Filter by town, price, and size — then tap any home for the full details.</p>
    </div>

    <div class="listings-filter reveal" role="tablist">
      <button class="lf-btn active" data-status="active">Active</button>
      <button class="lf-btn" data-status="pending">Pending</button>
      <button class="lf-btn" data-status="sold">Sold</button>
    </div>

    <div class="filterbar reveal" id="filterbar">
      <div class="fb-field">
        <label for="f-town">Town</label>
        <select id="f-town"><option value="">All towns</option></select>
      </div>
      <div class="fb-field">
        <label for="f-min">Min price</label>
        <select id="f-min"><option value="">No min</option></select>
      </div>
      <div class="fb-field">
        <label for="f-max">Max price</label>
        <select id="f-max"><option value="">No max</option></select>
      </div>
      <div class="fb-field">
        <label for="f-beds">Beds</label>
        <select id="f-beds">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
          <option value="5">5+</option>
        </select>
      </div>
      <div class="fb-field">
        <label for="f-baths">Baths</label>
        <select id="f-baths">
          <option value="0">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </div>
      <button class="fb-clear" id="f-clear" type="button">Clear</button>
    </div>

    <div class="fb-count" id="fb-count"></div>

    <div class="listings-grid" id="listings-grid">
      <div class="listings-state" id="listings-state">Loading listings…</div>
    </div>
  </div>
</section>

<section class="listings-cta">
  <div class="wrap">
    <div class="listings-cta-inner reveal">
      <h2>Don't see the right one yet?</h2>
      <p>New listings hit the market constantly — and the best ones move fast. Tell us what you're looking for and we'll get you first access.</p>
      <a class="listings-cta-btn" href="/#selector">Work With Us <span aria-hidden="true">&rarr;</span></a>
    </div>
  </div>
</section>

<footer class="footer">
  <div class="wrap footer-inner">
    <a class="brand" href="/" style="text-decoration:none;color:inherit">
      <span class="brand-logo" style="width:38px;height:38px"><img src="/logo.png" alt="" style="width:38px;height:38px"></span>
      <span class="brand-txt"><b>Dynamic Duo LI</b><span>Lucas · Nick · Jeff</span></span>
    </a>
    <div class="footer-contact">
      <a href="tel:+15168261111">516-826-1111</a>
      <a href="mailto:dynamicduoli@therealtyadvisors.com">dynamicduoli@therealtyadvisors.com</a>
      <a href="https://maps.google.com/?q=3341+Park+Avenue+Wantagh+NY+11793" target="_blank" rel="noopener noreferrer">3341 Park Ave, Wantagh, NY</a>
    </div>
    <div class="footer-note">Realty Advisors · Licensed Real Estate Professionals · Long Island, NY<br>&copy; 2026 Dynamic Duo LI. All rights reserved.</div>
  </div>
</footer>

<div class="detail-overlay" id="detail-overlay" hidden>
  <div class="detail-backdrop" data-close></div>
  <div class="detail-panel" role="dialog" aria-modal="true" aria-label="Listing details">
    <button class="detail-close" id="detail-close" aria-label="Close">&times;</button>
    <div class="detail-scroll" id="detail-scroll"></div>
  </div>
</div>`;

const SCRIPT = `
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const io=new IntersectionObserver((es)=>{es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
})},{threshold:.14,rootMargin:'0px 0px -7% 0px'});
document.querySelectorAll('.reveal:not(.in)').forEach(el=>io.observe(el));

const topbar=document.getElementById('topbar');
if(topbar){addEventListener('scroll',()=>{topbar.classList.toggle('scrolled',scrollY>10);},{passive:true});}

/* ---- Our Listings ---- */
(function(){
  const grid=document.getElementById('listings-grid');
  const filterBtns=[...document.querySelectorAll('.lf-btn')];
  const elTown=document.getElementById('f-town');
  const elMin=document.getElementById('f-min');
  const elMax=document.getElementById('f-max');
  const elBeds=document.getElementById('f-beds');
  const elBaths=document.getElementById('f-baths');
  const elClear=document.getElementById('f-clear');
  const elCount=document.getElementById('fb-count');
  if(!grid) return;

  let DATA={active:[],pending:[],sold:[]};
  let current='active';

  const fmtPrice=n=> n==null?'':'$'+Number(n).toLocaleString('en-US');
  const esc=s=> String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const PRICE_STEPS=[300000,400000,500000,600000,700000,800000,900000,1000000,1250000,1500000,2000000,3000000];

  function activeListForFilters(){ return DATA[current]||[]; }

  function rebuildTownOptions(){
    const list=activeListForFilters();
    const towns=[...new Set(list.map(p=>p.city).filter(Boolean))].sort();
    const prev=elTown.value;
    elTown.innerHTML='<option value="">All towns</option>'+towns.map(t=>\`<option value="\${esc(t)}">\${esc(t)}</option>\`).join('');
    if(towns.includes(prev)) elTown.value=prev;
  }
  function buildPriceOptions(){
    const opts=PRICE_STEPS.map(v=>\`<option value="\${v}">\${fmtPrice(v)}</option>\`).join('');
    elMin.innerHTML='<option value="">No min</option>'+opts;
    elMax.innerHTML='<option value="">No max</option>'+opts;
  }
  function priceOf(p){ return current==='sold' ? (p.soldPrice||p.listPrice) : p.listPrice; }

  function applyFilters(list){
    const town=elTown.value;
    const min=elMin.value?Number(elMin.value):null;
    const max=elMax.value?Number(elMax.value):null;
    const beds=Number(elBeds.value)||0;
    const baths=Number(elBaths.value)||0;
    return list.filter(p=>{
      if(town && p.city!==town) return false;
      const pr=priceOf(p);
      if(min!=null && (pr==null||pr<min)) return false;
      if(max!=null && (pr==null||pr>max)) return false;
      if(beds && (p.beds==null||p.beds<beds)) return false;
      if(baths && (p.baths==null||p.baths<baths)) return false;
      return true;
    });
  }

  function card(p,idx){
    const photos=(p.photos&&p.photos.length)?p.photos:[];
    const slides=photos.length
      ? photos.slice(0,12).map(u=>\`<div class="lc-slide"><img loading="lazy" src="\${esc(u)}" alt="\${esc(p.address)}"></div>\`).join('')
      : '<div class="lc-noimg">No photo available</div>';
    const dots=photos.length>1
      ? \`<div class="lc-dots">\${photos.slice(0,12).map((_,i)=>\`<span class="lc-dot\${i===0?' on':''}"></span>\`).join('')}</div>\` : '';
    const navs=photos.length>1
      ? '<button class="lc-nav lc-prev" aria-label="Previous photo">&#8249;</button><button class="lc-nav lc-next" aria-label="Next photo">&#8250;</button>' : '';
    const statusClass = current==='sold'?'sold':(current==='pending'?'pending':'');
    const statusLabel = current==='sold'?'Sold':(current==='pending'?'Pending':'Active');
    const priceBlock = (current==='sold'&&p.soldPrice)
      ? \`\${fmtPrice(p.listPrice)?'<span style="color:var(--muted-2);font-size:15px;text-decoration:line-through;margin-right:8px">'+fmtPrice(p.listPrice)+'</span>':''}<span class="lc-sold">Sold \${fmtPrice(p.soldPrice)}</span>\`
      : fmtPrice(p.listPrice)||'Contact for price';
    const specs=[];
    if(p.beds!=null) specs.push(\`<span><b>\${p.beds}</b> bd</span>\`);
    if(p.baths!=null) specs.push(\`<span><b>\${p.baths}</b> ba</span>\`);
    if(p.sqft!=null) specs.push(\`<span><b>\${Number(p.sqft).toLocaleString('en-US')}</b> sqft</span>\`);
    const dom = p.dom!=null ? \`<div class="lc-dom">\${p.dom} days on market</div>\` : '';
    return \`<article class="listing-card" data-idx="\${idx}">
      <div class="lc-gallery">
        <span class="lc-status \${statusClass}">\${statusLabel}</span>
        <div class="lc-track">\${slides}</div>
        \${navs}\${dots}
      </div>
      <div class="lc-body">
        <div class="lc-price">\${priceBlock}</div>
        <div class="lc-addr">\${esc(p.address)||'Address available on request'}</div>
        <div class="lc-city">\${esc([p.city,p.state].filter(Boolean).join(', '))} \${esc(p.zip)}</div>
        \${specs.length?\`<div class="lc-specs">\${specs.join('')}</div>\`:''}
        \${dom}
        <button class="lc-view" type="button" data-view="\${idx}">View details</button>
      </div>
    </article>\`;
  }

  let VISIBLE=[];

  function render(){
    rebuildTownOptions();
    const base=activeListForFilters();
    VISIBLE=applyFilters(base);

    elCount.textContent = VISIBLE.length
      ? \`Showing \${VISIBLE.length} of \${base.length} \${current} \${base.length===1?'home':'homes'}\`
      : '';

    if(!base.length){
      grid.innerHTML=\`<div class="listings-state">No \${current} listings to show right now. Check back soon — or <a href="/#selector" style="color:var(--brass)">get in touch</a>.</div>\`;
      return;
    }
    if(!VISIBLE.length){
      grid.innerHTML=\`<div class="listings-state">No \${current} homes match those filters. <button class="linklike" id="reset-inline">Clear filters</button> to see all \${base.length}.</div>\`;
      const r=document.getElementById('reset-inline');
      if(r) r.addEventListener('click',clearFilters);
      return;
    }
    grid.innerHTML=VISIBLE.map((p,i)=>card(p,i)).join('');
    wireGalleries();
  }

  function wireGalleries(){
    grid.querySelectorAll('.lc-gallery').forEach(g=>{
      const track=g.querySelector('.lc-track');
      const slides=g.querySelectorAll('.lc-slide');
      const dots=g.querySelectorAll('.lc-dot');
      if(slides.length<2) return;
      let i=0;
      const go=n=>{i=(n+slides.length)%slides.length;track.style.transform=\`translateX(-\${i*100}%)\`;
        dots.forEach((d,di)=>d.classList.toggle('on',di===i));};
      g.querySelector('.lc-next')?.addEventListener('click',e=>{e.stopPropagation();go(i+1);});
      g.querySelector('.lc-prev')?.addEventListener('click',e=>{e.stopPropagation();go(i-1);});
      let x0=null;
      g.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
      g.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;
        if(Math.abs(dx)>40)go(dx<0?i+1:i-1);x0=null;},{passive:true});
    });
  }

  grid.addEventListener('click',e=>{
    if(e.target.closest('.lc-nav')) return;
    const cardEl=e.target.closest('.listing-card');
    if(!cardEl) return;
    const idx=Number(cardEl.dataset.idx);
    if(!Number.isNaN(idx) && VISIBLE[idx]) openDetail(VISIBLE[idx]);
  });

  [elTown,elMin,elMax,elBeds,elBaths].forEach(el=>el.addEventListener('change',render));
  function clearFilters(){
    elTown.value=''; elMin.value=''; elMax.value=''; elBeds.value='0'; elBaths.value='0';
    render();
  }
  elClear.addEventListener('click',clearFilters);

  filterBtns.forEach(b=>b.addEventListener('click',()=>{
    filterBtns.forEach(x=>x.classList.toggle('active',x===b));
    current=b.dataset.status;
    clearFilters();
  }));

  // ----- detail overlay -----
  const overlay=document.getElementById('detail-overlay');
  const scroll=document.getElementById('detail-scroll');
  const closeBtn=document.getElementById('detail-close');

  function chipRow(label,arr){
    if(!arr||!arr.length) return '';
    return \`<div class="dv-featgroup"><h4>\${esc(label)}</h4><div class="dv-chips">\${arr.map(x=>\`<span>\${esc(x)}</span>\`).join('')}</div></div>\`;
  }
  function statRow(label,val){
    if(val==null||val==='') return '';
    return \`<div class="dv-stat"><span class="dv-stat-l">\${esc(label)}</span><span class="dv-stat-v">\${esc(val)}</span></div>\`;
  }

  function openDetail(p){
    const photos=(p.photos&&p.photos.length)?p.photos:[];
    const statusLabel = p.status==='closed'||p.status==='sold'?'Sold':(p.status==='pending'?'Pending':'Active');
    const priceBlock = (statusLabel==='Sold'&&p.soldPrice)
      ? \`<span class="dv-sold">Sold \${fmtPrice(p.soldPrice)}</span>\${p.listPrice?\`<span class="dv-listprice">Listed \${fmtPrice(p.listPrice)}</span>\`:''}\`
      : (fmtPrice(p.listPrice)||'Contact for price');

    const gallery = photos.length
      ? \`<div class="dv-gallery">
           <div class="dv-track">\${photos.map(u=>\`<div class="dv-slide"><img src="\${esc(u)}" alt="\${esc(p.address)}"></div>\`).join('')}</div>
           \${photos.length>1?'<button class="dv-nav dv-prev" aria-label="Previous">&#8249;</button><button class="dv-nav dv-next" aria-label="Next">&#8250;</button><div class="dv-counter"><span id="dv-cur">1</span> / '+photos.length+'</div>':''}
         </div>\`
      : '<div class="dv-noimg">No photos available</div>';

    const keyStats=[
      p.beds!=null?\`<div class="dv-key"><b>\${p.beds}</b><span>Beds</span></div>\`:'',
      p.baths!=null?\`<div class="dv-key"><b>\${p.baths}</b><span>Baths</span></div>\`:'',
      p.sqft!=null?\`<div class="dv-key"><b>\${Number(p.sqft).toLocaleString('en-US')}</b><span>Sq Ft</span></div>\`:'',
      p.yearBuilt!=null?\`<div class="dv-key"><b>\${p.yearBuilt}</b><span>Built</span></div>\`:''
    ].filter(Boolean).join('');

    const lot = p.lotSqft!=null ? Number(p.lotSqft).toLocaleString('en-US')+' sqft'
              : (p.acres!=null ? p.acres+' acres' : null);

    const facts=[
      statRow('Property type',p.propType),
      statRow('Status',statusLabel),
      statRow('Full baths',p.fullBaths),
      statRow('Half baths',p.halfBaths),
      statRow('Lot size',lot),
      statRow('Year built',p.yearBuilt),
      statRow('Subdivision',p.subdivision),
      statRow('County',p.county),
      statRow('School district',p.schoolDistrict),
      statRow('Annual taxes',p.taxes!=null?fmtPrice(p.taxes):null),
      statRow('Days on market',p.dom!=null?p.dom:null),
      p.waterfront?statRow('Waterfront','Yes'):'',
      p.pool?statRow('Pool','Yes'):'',
      p.garage?statRow('Garage',typeof p.garage==='number'?p.garage+' car':'Yes'):''
    ].filter(Boolean).join('');

    const features=[
      chipRow('Interior',p.interior),
      chipRow('Heating',p.heating),
      chipRow('Cooling',p.cooling),
      chipRow('Appliances',p.appliances)
    ].filter(Boolean).join('');

    scroll.innerHTML=\`
      \${gallery}
      <div class="dv-body">
        <div class="dv-head">
          <div>
            <span class="dv-status \${statusLabel==='Sold'?'sold':(statusLabel==='Pending'?'pending':'')}">\${statusLabel}</span>
            <div class="dv-price">\${priceBlock}</div>
            <div class="dv-addr">\${esc(p.address)}</div>
            <div class="dv-city">\${esc([p.city,p.state].filter(Boolean).join(', '))} \${esc(p.zip)}</div>
          </div>
        </div>
        \${keyStats?\`<div class="dv-keys">\${keyStats}</div>\`:''}
        \${p.description?\`<div class="dv-desc"><h4>About this home</h4><p>\${esc(p.description)}</p></div>\`:''}
        \${facts?\`<div class="dv-facts"><h4>Details</h4><div class="dv-factgrid">\${facts}</div></div>\`:''}
        \${features?\`<div class="dv-features"><h4>Features</h4>\${features}</div>\`:''}
        <div class="dv-actions">
          \${p.url?\`<a class="dv-btn-ghost" href="\${esc(p.url)}" target="_blank" rel="noopener noreferrer">Full MLS listing &rarr;</a>\`:''}
          <a class="dv-btn" href="/#selector">Ask us about this home</a>
        </div>
      </div>\`;

    const track=scroll.querySelector('.dv-track');
    if(track){
      const slides=scroll.querySelectorAll('.dv-slide');
      const cur=scroll.querySelector('#dv-cur');
      let i=0;
      const go=n=>{i=(n+slides.length)%slides.length;track.style.transform=\`translateX(-\${i*100}%)\`;if(cur)cur.textContent=i+1;};
      scroll.querySelector('.dv-next')?.addEventListener('click',()=>go(i+1));
      scroll.querySelector('.dv-prev')?.addEventListener('click',()=>go(i-1));
      let x0=null;
      track.parentElement.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;},{passive:true});
      track.parentElement.addEventListener('touchend',e=>{if(x0==null)return;const dx=e.changedTouches[0].clientX-x0;
        if(Math.abs(dx)>40)go(dx<0?i+1:i-1);x0=null;},{passive:true});
    }

    overlay.hidden=false;
    document.body.style.overflow='hidden';
    scroll.scrollTop=0;
    closeBtn.focus();
  }

  function closeDetail(){
    overlay.hidden=true;
    document.body.style.overflow='';
  }
  closeBtn.addEventListener('click',closeDetail);
  overlay.querySelector('[data-close]').addEventListener('click',closeDetail);
  addEventListener('keydown',e=>{ if(e.key==='Escape' && !overlay.hidden) closeDetail(); });

  // ----- fetch -----
  buildPriceOptions();
  fetch('/api/listings').then(r=>r.json()).then(d=>{
    DATA={active:d.active||[],pending:d.pending||[],sold:d.sold||[]};
    filterBtns.forEach(b=>{
      const s=b.dataset.status;
      if(s!=='active' && !(DATA[s]&&DATA[s].length)) b.style.display='none';
    });
    render();
  }).catch(()=>{
    grid.innerHTML='<div class="listings-state">Listings are temporarily unavailable. Please <a href="/#selector" style="color:var(--brass)">contact us</a> and we will send you what is available.</div>';
  });
})();
`;

export default function Listings() {
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      } catch (e) {
        console.error("Listings page script error:", e);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
