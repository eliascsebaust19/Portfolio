// Custom EA monogram, 324 x 240 design units. Single compound path (evenodd).
export const E_D = "M0 0H118V36H38V102H98V138H38V204H118V240H0Z";
export const A_OUTER = "M156 240L222 0H258L324 240H284L269.15 186H210.85L196 240Z";
export const A_HOLE = "M240 80L259.25 150H220.75Z";
export const EA_D = `${E_D}${A_OUTER}${A_HOLE}`;

export const LOGO_W = 324;
export const LOGO_H = 240;
export const LOGO_PAD = 24;
export const LOGO_VIEWBOX = `${-LOGO_PAD} ${-LOGO_PAD} ${LOGO_W + LOGO_PAD * 2} ${LOGO_H + LOGO_PAD * 2}`;
