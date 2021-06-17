<template>
  <q-dialog v-model="loadingMarkers">
      <img  class="loadinglogo" src="logo/logo.ico" style="width:150px"/>
  </q-dialog>
</template>

<script>
export default {
    data(){
        return{
            loadingMarkers:true
        }
    }

}
</script>

<style>
.loadinglogo{
  animation: roll 3s infinite;
  opacity: .7;
  }
@keyframes roll {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>