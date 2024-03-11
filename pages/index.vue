<script setup lang="ts">
const counter = useState("counter", () => 0);
</script>
<template>
  <div class="text-center mt-4">
    <h1>{{ counter }}</h1>
    <Button label="Submit" />
    <Button
      label="Button"
      :disabled="true"
      @click="counter++"
      size="small"
      severity="primary"
      text
    />
    <Button label="Submit" />
  </div>
</template>
<style></style>
