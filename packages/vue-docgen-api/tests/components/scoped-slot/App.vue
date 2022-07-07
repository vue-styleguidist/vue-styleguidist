<template>
	<!--
  @slot for customizing individual days.
    @binding {date} date The date instance of the day
    @binding {number} day The day number (e.g 21)
    @binding {string} aria-label aria-label for the day
-->
<slot
  name="day"
  :date="date"
  :day="day"
  :aria-label="ariaLabel"
></slot>
</template>
