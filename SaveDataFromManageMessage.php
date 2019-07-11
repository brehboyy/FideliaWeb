
<?php ?>
<script type="text/javascript">
$("#selectsearch").change(function() {
  var action = $(this).val() == "people" ? "user" : "content";
  $("#search-form").attr("action", "/search/" + action);
});
</script>