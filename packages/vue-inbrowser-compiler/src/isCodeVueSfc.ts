export default function isCodeVueSfc(code: string) {
	return /\n\W*<script/.test(code) || /\n\W*<template/.test(code)
}
