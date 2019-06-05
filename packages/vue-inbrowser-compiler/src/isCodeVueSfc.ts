export default function isCodeVueSfc(code: string) {
	if (/\n\W*<script/.test(code)) {
		return true
	}
	const temp = /\n\W*<template(.*)>/.exec(code)
	if (temp) {
		return !/slot=".*"/.test(temp[1]) && !/#/.test(temp[1])
	}
	return false
}
