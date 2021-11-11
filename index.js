import { visit } from 'unist-util-visit';
import { findPhoneNumbersInText } from 'libphonenumber-js';


export default function remarkPhones(options = {}) {
    return (tree, file) => {
        visit(tree, 'text', (node) => {
            const value = node.value;
            const slices = [];
            let position = 0;
            const country = options.country || 'US'
            const matches = findPhoneNumbersInText(value, country);
            for (const match of matches) {
                const original = value.slice(match.startsAt, match.endsAt);
                const formattedNumber = `<a href="${match.number.getURI()}">${original}</a>`;
                slices.push(value.slice(position, match.startsAt));
                slices.push(formattedNumber);
                position = match.endsAt;
            }
            
            if (slices.length > 0) {
                slices.push(value.slice(position));
                const final = slices.join('');
                node.value = final;
            }
          })
    }
  }
