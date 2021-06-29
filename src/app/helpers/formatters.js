import numeral from 'numeral';

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

const abbreviatedCurrency = {
	format(number) {
		if( number < 1000000 ){
			return currencyFormatter.format(
				Math.round(number/1000) * 1000
			);
		}
		else {
			return numeral(number).format('$0.00a').toUpperCase()
		}
	}
};

export {currencyFormatter, abbreviatedCurrency};