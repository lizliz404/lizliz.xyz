import ArrowRight from '../assets/iconoir/ArrowRight.svg?raw';
import Search from '../assets/iconoir/Search.svg?raw';
import OpenInWindow from '../assets/iconoir/OpenInWindow.svg?raw';
import NavArrowDown from '../assets/iconoir/NavArrowDown.svg?raw';
import HalfMoon from '../assets/iconoir/HalfMoon.svg?raw';
import SunLight from '../assets/iconoir/SunLight.svg?raw';
import Translate from '../assets/iconoir/Translate.svg?raw';
import Plus from '../assets/iconoir/Plus.svg?raw';
import Minus from '../assets/iconoir/Minus.svg?raw';
import Xmark from '../assets/iconoir/Xmark.svg?raw';
import Download from '../assets/iconoir/Download.svg?raw';

const icons = { ArrowRight, Search, OpenInWindow, NavArrowDown, HalfMoon, SunLight, Translate, Plus, Minus, Xmark, Download };
export type IconName = keyof typeof icons;
interface IconProps { name: IconName; size?: 'sm' | 'md' | 'lg' }
/** Canonical Iconoir 7.12.2 regular SVG, vendored verbatim; decorative, never focusable. */
export function Icon(props: IconProps) {
  return <span class="iconoir" data-size={props.size ?? 'md'} aria-hidden="true" innerHTML={icons[props.name]}/>;
}
