// Fair housing / NY DOS compliance links. Verified 2026-11-03.
export const NOTICE_URL = "https://dos.ny.gov/fair-housing-notice"; // NYS Housing and Anti-Discrimination Notice (DOS)
export const NOTICE_PDF = "https://dos.ny.gov/system/files/documents/2025/03/nys-housing-and-anti-discrimination-notice_02.2025.pdf";
export const HUD_COMPLAINT_URL = "https://www.hud.gov/fairhousing/fileacomplaint";
export const DHR_COMPLAINT_URL = "https://dhr.ny.gov/complaint";
export const DOS_FAIR_HOUSING_URL = "https://dos.ny.gov/fair-housing";
// [confirm] Realty Advisors' Standard Operating Procedures URL. The SOP link renders only when this is set.
export const SOP_URL = "";

const EHO_SVG =
  '<svg class="eho-mark" viewBox="0 0 40 40" width="34" height="34" role="img" aria-label="Equal Housing Opportunity">' +
  '<path d="M20 4 3 17h4v18h26V17h4L20 4z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<rect x="12" y="19" width="16" height="3.2" fill="currentColor"/><rect x="12" y="25" width="16" height="3.2" fill="currentColor"/></svg>';

export const FOOTER_FH_HTML =
  `<div class="fh-foot">${EHO_SVG}<p><b>Equal Housing Opportunity.</b> We are pledged to the letter and spirit of U.S. and New York State policy for equal housing opportunity. ` +
  `<a href="${NOTICE_URL}" target="_blank" rel="noopener noreferrer">NYS Housing and Anti-Discrimination Notice</a> · <a href="/fair-housing">Fair Housing</a>` +
  (SOP_URL ? ` · <a href="${SOP_URL}" target="_blank" rel="noopener noreferrer">Standard Operating Procedures</a>` : "") +
  `</p></div>`;

export const FORM_FH_NOTE =
  '<p class="fh-note">We follow all federal, state and local fair housing laws, and we can&rsquo;t accept or act on preferences about protected characteristics such as race, religion, family status, disability or source of income.</p>';
