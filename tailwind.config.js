module.exports = {
  purge: ['./src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {},
  variants: {},
  plugins: [
    require('tw-elements/dist/plugin')
  ],
}