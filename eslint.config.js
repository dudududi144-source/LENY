/* eslint.config.js — ESLint flat config
   כללים: recommended + התאמות למשחק דפדפן ללא באנדלר */
import js from '@eslint/js';
import globals from 'globals';

export default [
 {ignores:['classic/**','node_modules/**','.github/**','assets/**']},
 js.configs.recommended,
 {
  files:['js/**/*.js','sw.js'],
  languageOptions:{ecmaVersion:2022,sourceType:'module',globals:{...globals.browser}},
  rules:{'no-empty':['error',{allowEmptyCatch:true}],'no-unused-vars':['error',{caughtErrors:'none'}]}
 },
 {
  files:['tests/**/*.js','vitest.config.js'],
  languageOptions:{ecmaVersion:2022,sourceType:'module',
   globals:{...globals.browser,describe:'readonly',it:'readonly',expect:'readonly',
    vi:'readonly',beforeEach:'readonly',afterEach:'readonly',beforeAll:'readonly',afterAll:'readonly'}},
  rules:{'no-empty':['error',{allowEmptyCatch:true}],'no-unused-vars':['error',{caughtErrors:'none'}]}
 }
];
