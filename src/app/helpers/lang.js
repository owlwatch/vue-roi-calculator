import MarkdownIt from 'markdown-it';
import {currencyFormatter} from './formatters';
const strings = {};

const md = new MarkdownIt({
	html: true
});

const modifiers = {
	uppercase: str => str.toUpperCase(),
	lowercase: str => str.toLowerCase(),
	currency: str => currencyFormatter.format(str)
};

function translate(key, useMarkdown, context, _default){
	if( strings[key] ){
		let ret = strings[key];
		ret = ret.replaceAll(/\{\{(.+?)\}\}/gi, (full, match) => {
			const parts = match.trim().split('|').map(str => str.trim());
			const name = parts.shift();
			let val = context[name];
			while( parts.length > 0 ){
				let modifier = parts.shift();
				const [key, arg] = modifier.split(" ", 2);
				if( modifiers[key] ){
					val = modifiers[key](val, arg);
				}
			}
			return val;
		});
		return useMarkdown ? md.render(ret) : ret;
	}
	return _default !== undefined ? _default : key;
}


function loadLanguageStrings(map){
	Object.assign( strings, map );
}

export default translate;
export {
	loadLanguageStrings,
	translate
};
