<template>
  <div>
    {{ niceDate }}
  </div>
</template>

<script>
import { date } from "quasar";

export default {
  props: ["dateprop"],
  computed: {
    niceDate: function () {
      // let date_created1 = this.dateprop
      if (this.dateprop) {
        let date_created = this.dateprop.split(" ").join("");
        let timeStamp = Date.now();
        let show_date = date.formatDate(date_created, "DD/MM/YY");

        // let unit = 'days'
        let diff_years = date.getDateDiff(timeStamp, date_created, "years");
        let diff_months = date.getDateDiff(timeStamp, date_created, "months");
        let diff_days = date.getDateDiff(timeStamp, date_created, "days");
        let diff_hours = date.getDateDiff(timeStamp, date_created, "hours");
        let diff_minutes = date.getDateDiff(timeStamp, date_created, "minutes");
        let diff_seconds = date.getDateDiff(timeStamp, date_created, "seconds");
        // let formattedString = date.formatDate(difference, 'D-MMM-YYYY')
        if (diff_days > 1) {
          return show_date;
        } else if (diff_seconds > 0) {
          return "today";
        } else if (diff_seconds === 0) {
          return "now";
        } else {
          return show_date;
        }
      }
    },
  },
};
</script>

<style></style>
