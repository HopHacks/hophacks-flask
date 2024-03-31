module.exports = {
    "extends": process.env.REACT_APP_DEV_DISABLE_ESLINT ? [] : [
      "eslint:recommended",
      "plugin:import/errors",
      "plugin:import/warnings",
      "plugin:json/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:react/recommended",
    ],
    "rules": process.env.REACT_APP_DEV_DISABLE_ESLINT ? {} : {
      // ...rules for production CI
    }
}