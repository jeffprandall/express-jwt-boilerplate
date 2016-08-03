module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": [
            "error",
            { allow:
                ["warn", "error"]
            }
        ],
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ]
    }
};
