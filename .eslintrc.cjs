module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 'latest',
		'sourceType': 'module'
	},
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'always'
		],
		'eqeqeq': [
			'error',
			'always'
		],
		'arrow-body-style': [
			'error', 
			'always'
		],
		'camelcase': [
			'error',
			{
				// Prevents database key names from being flagged.
				'properties': 'never'
			}
		],
		'eol-last': [
			'error'
		]
	}
};
