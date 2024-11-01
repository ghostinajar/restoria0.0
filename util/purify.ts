import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import { Filter } from "bad-words";

const window = new JSDOM("").window;
const purify = DOMPurify(window);
export const wordFilter = new Filter();

export function purifyCommandInput(input: string): string {
  let sanitizedInput = purify.sanitize(input);
  return wordFilter.clean(sanitizedInput);
}

export function purifyAllStringPropsOfObject(object: any) {
  if (object && typeof object === 'object') {
    for (const key in object) {
      if (typeof object[key] === 'string') {
        object[key] = wordFilter.clean(purify.sanitize(object[key]));
      } else if (Array.isArray(object[key])) {
        object[key] = object[key].map(item =>
          typeof item === 'string' ? wordFilter.clean(purify.sanitize(item)) : purifyAllStringPropsOfObject(item)
        );
      } else if (typeof object[key] === 'object') {
        purifyAllStringPropsOfObject(object[key]);
      }
    }
  }
  return object;
}

export function purifyDescriptionOfObject(object: any) {
  if (object.name) {
    object.name = wordFilter.clean(purify.sanitize(object.name));
  }

  if (object.keywords) {
    object.keywords = object.keywords.map((keyword: string) =>
      wordFilter.clean(purify.sanitize(keyword))
    );
  }

  if (object.description) {
    if (object.description.look) {
      object.description.look = wordFilter.clean(
        purify.sanitize(object.description.look)
      );
    }
    if (object.description.examine) {
      object.description.examine = wordFilter.clean(
        purify.sanitize(object.description.examine)
      );
    }
    if (object.description.study) {
      object.description.study = wordFilter.clean(
        purify.sanitize(object.description.study)
      );
    }
    if (object.description.research) {
      object.description.research = wordFilter.clean(
        purify.sanitize(object.description.research)
      );
    }
  }
  return object;
}

export default purifyDescriptionOfObject;
// to use: const clean = purify.sanitize('<b>hello there</b>');
