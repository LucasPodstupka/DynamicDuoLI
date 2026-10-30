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
      <p class="listings-sub">Browse our team’s active listings across Long Island. Tap any home for full details, photos, and to get in touch.</p>
    </div>

    <div class="idx-widget-wrap reveal">
      <div id="idx-widget-mount"></div>
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
(function(){
  var mount = document.getElementById('idx-widget-mount');
  if(mount){
    var s = document.createElement('script');
    s.charset = 'UTF-8';
    s.type = 'text/javascript';
    s.id = 'idxwidgetsrc-183306';
    s.src = '//therealtyadvisors.idxbroker.com/idx/widgets/183306';
    mount.appendChild(s);
  }
  try {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    document.querySelectorAll('.reveal:not(.in)').forEach(function(el){ io.observe(el); });
  } catch(e){
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }
  var topbar = document.getElementById('topbar');
  if(topbar){ addEventListener('scroll', function(){ topbar.classList.toggle('scrolled', scrollY>10); }, {passive:true}); }
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
