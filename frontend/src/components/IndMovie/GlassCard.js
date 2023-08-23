import React from "react";
import PropTypes from "prop-types";
import "./GlassCard.css";
import { ParseNumber } from "./MovieComponents";
const languageMap = {
  "af": "Afrikaans",
  "sq": "Albanian",
  "ar-dz": "Arabic (Algeria)",
  "ar-bh": "Arabic (Bahrain)",
  "ar-eg": "Arabic (Egypt)",
  "ar-iq": "Arabic (Iraq)",
  "ar-jo": "Arabic (Jordan)",
  "ar-kw": "Arabic (Kuwait)",
  "ar-lb": "Arabic (Lebanon)",
  "ar-ly": "Arabic (Libya)",
  "ar-ma": "Arabic (Morocco)",
  "ar-om": "Arabic (Oman)",
  "ar-qa": "Arabic (Qatar)",
  "ar-sa": "Arabic (Saudi Arabia)",
  "ar-sy": "Arabic (Syria)",
  "ar-tn": "Arabic (Tunisia)",
  "ar-ae": "Arabic (U.A.E.)",
  "ar-ye": "Arabic (Yemen)",
  "eu": "Basque",
  "be": "Belarusian",
  "bg": "Bulgarian",
  "ca": "Catalan",
  "zh-hk": "Chinese (Hong Kong)",
  "zh-cn": "Chinese (PRC)",
  "zh-sg": "Chinese (Singapore)",
  "zh-tw": "Chinese (Taiwan)",
  "hr": "Croatian",
  "cs": "Czech",
  "da": "Danish",
  "nl-be": "Dutch (Belgium)",
  "nl": "Dutch (Standard)",
  "en": "English",
  "en-au": "English (Australia)",
  "en-bz": "English (Belize)",
  "en-ca": "English (Canada)",
  "en-ie": "English (Ireland)",
  "en-jm": "English (Jamaica)",
  "en-nz": "English (New Zealand)",
  "en-za": "English (South Africa)",
  "en-tt": "English (Trinidad)",
  "en-gb": "English (United Kingdom)",
  "en-us": "English (United States)",
  "et": "Estonian",
  "fo": "Faeroese",
  "fa": "Farsi",
  "fi": "Finnish",
  "fr-be": "French (Belgium)",
  "fr-ca": "French (Canada)",
  "fr-lu": "French (Luxembourg)",
  "fr": "French (Standard)",
  "fr-ch": "French (Switzerland)",
  "gd": "Gaelic (Scotland)",
  "de-at": "German (Austria)",
  "de-li": "German (Liechtenstein)",
  "de-lu": "German (Luxembourg)",
  "de": "German (Standard)",
  "de-ch": "German (Switzerland)",
  "el": "Greek",
  "he": "Hebrew",
  "hi": "Hindi",
  "hu": "Hungarian",
  "is": "Icelandic",
  "id": "Indonesian",
  "ga": "Irish",
  "it": "Italian (Standard)",
  "it-ch": "Italian (Switzerland)",
  "ja": "Japanese",
  "ko": "Korean",
  "ku": "Kurdish",
  "lv": "Latvian",
  "lt": "Lithuanian",
  "mk": "Macedonian (FYROM)",
  "ml": "Malayalam",
  "ms": "Malaysian",
  "mt": "Maltese",
  "no": "Norwegian",
  "nb": "Norwegian (Bokmål)",
  "nn": "Norwegian (Nynorsk)",
  "pl": "Polish",
  "pt-br": "Portuguese (Brazil)",
  "pt": "Portuguese (Portugal)",
  "pa": "Punjabi",
  "rm": "Rhaeto-Romanic",
  "ro": "Romanian",
  "ro-md": "Romanian (Republic of Moldova)",
  "ru": "Russian",
  "ru-md": "Russian (Republic of Moldova)",
  "sr": "Serbian",
  "sk": "Slovak",
  "sl": "Slovenian",
  "sb": "Sorbian",
  "es-ar": "Spanish (Argentina)",
  "es-bo": "Spanish (Bolivia)",
  "es-cl": "Spanish (Chile)",
  "es-co": "Spanish (Colombia)",
  "es-cr": "Spanish (Costa Rica)",
  "es-do": "Spanish (Dominican Republic)",
  "es-ec": "Spanish (Ecuador)",
  "es-sv": "Spanish (El Salvador)",
  "es-gt": "Spanish (Guatemala)",
  "es-hn": "Spanish (Honduras)",
  "es-mx": "Spanish (Mexico)",
  "es-ni": "Spanish (Nicaragua)",
  "es-pa": "Spanish (Panama)",
  "es-py": "Spanish (Paraguay)",
  "es-pe": "Spanish (Peru)",
  "es-pr": "Spanish (Puerto Rico)",
  "es": "Spanish (Spain)",
  "es-uy": "Spanish (Uruguay)",
  "es-ve": "Spanish (Venezuela)",
  "sv": "Swedish",
  "sv-fi": "Swedish (Finland)",
  "th": "Thai",
  "ts": "Tsonga",
  "tn": "Tswana",
  "tr": "Turkish",
  "ua": "Ukrainian",
  "ur": "Urdu",
  "ve": "Venda",
  "vi": "Vietnamese",
  "cy": "Welsh",
  "xh": "Xhosa",
  "ji": "Yiddish",
  "zu": "Zulu",
};
export default function GlassCard({ name, value, icon, iconString }) {

  let data;
  // Helper function to get the full language name from the ISO code
  function getLanguageName(isoCode) {
    // Define an object mapping ISO codes to full language names

    const hasKey = isoCode in languageMap; // Check if the ISO code exists in the languageMap

    if (hasKey) {
      return languageMap[isoCode]; // Return the corresponding language name
    } else {
      return "Unknown"; // Return "Unknown" if the ISO code is not found
    }
  }

  !value ? (value = "N/A") : value;

  if (iconString === "&#xef63;") {
    // Budget
    data = "$ " + ParseNumber(value);
  } else if (iconString === "&#xe8b5;") {
    // Minutes
    data = ` ${value} minutes`;
  } else if (iconString === "&#xf041;") {
    // Revenue
    data = "$ " + ParseNumber(value);
  } else if (iconString === "&#xe175;") {
    // Vote Count
    data = ParseNumber(value);
  } else if (iconString === "&#xe8e2;") {
    // Language
    // Check if the value is an ISO code and convert it to the full language name
    let language = getLanguageName(value);
    data = ` ${language} `;
  } else if (iconString === "&#xe04b;") {
    // Get the first production company or returns N/A
    const productionCompany = Array.isArray(value) && value.length > 0 ? value[0] : null;
    // If the value exists and its length is less than or equal to 18 characters, return it as is
    data = productionCompany && productionCompany.length <= 18 ?
      productionCompany
      :
      // Otherwise, return the first 18 characters plus "..."
      productionCompany ? productionCompany.slice(0, 18) + "..." : "N/A";

  } else if (iconString === "&#xf7f3;") {
    // Movie Status
    data = ` ${value} `;
  } else if (iconString === "&#xebcc;") {
    // Release Date
    data = ` ${value} `;
  }



  return (
    <div className="container">
      <div className="box">
        <div className="content">
          <span className="title">{name}</span>
          <div className="icon-container">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div className="value-container">
            <p>{data}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
GlassCard.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.array
  ]),
  iconString: PropTypes.string,
};