import Alipay from "../assets/icons/CC-icons/alipay.svg";
import Amex from "../assets/icons/CC-icons/amex.svg";
import CodeFront from "../assets/icons/CC-icons/code-front.svg";
import Code from "../assets/icons/CC-icons/code.svg";
import Diners from "../assets/icons/CC-icons/diners.svg";
import Discover from "../assets/icons/CC-icons/discover.svg";
import Elo from "../assets/icons/CC-icons/elo.svg";
import Generic from "../assets/icons/CC-icons/generic.svg";
import Hipercard from "../assets/icons/CC-icons/hipercard.svg";
import Hiper from "../assets/icons/CC-icons/hiper.svg";
import Jcb from "../assets/icons/CC-icons/jcb.svg";
import Maestro from "../assets/icons/CC-icons/maestro.svg";
import Mastercard from "../assets/icons/CC-icons/mastercard.svg";
import Mir from "../assets/icons/CC-icons/mir.svg";
import Paypal from "../assets/icons/CC-icons/paypal.svg";
import Unionpay from "../assets/icons/CC-icons/unionpay.svg";
import Visa from "../assets/icons/CC-icons/visa.svg";
import React from "react";

const availableIcons: any = {
  alipay: Alipay,
  amex: Amex,
  "code-front": CodeFront,
  code: Code,
  diners: Diners,
  discover: Discover,
  elo: Elo,
  generic: Generic,
  hipercard: Hipercard,
  hiper: Hiper,
  jcb: Jcb,
  maestro: Maestro,
  mastercard: Mastercard,
  mir: Mir,
  paypal: Paypal,
  unionpay: Unionpay,
  visa: Visa,
};

/**
 * Return an SVG payment icon as an img tag for use in an HTML document.
 *
 * @param {string} name - The name of the icon to return.
 *
 * @returns {Image} An <img> tag that displays the selected icon.
 */
export function ccIcon(name: string) {
  const iconSrc = availableIcons[name] || availableIcons.generic;
  return <img src={iconSrc} alt={`${name} icon`} />;
}
