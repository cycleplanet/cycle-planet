<template>
    <div>
        
        <q-editor
            @paste.native="evt => pasteCapture(evt)"
            ref="editor_ref"
            v-model="data"
            @input="$emit('update:data', $event)"
            :rules="[val => !!val || 'Field is required']"
            :dense="$q.screen.lt.md"
            :toolbar="[
                ['bold', 'italic', 'underline'],
                ['link'],
                ['unordered', 'ordered'],
                ['viewsource']
            ]"
            >
        </q-editor>
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'

export default {
  	mixins: [mixinGeneral, ],
    props:['data'],

}
</script>

<style>

</style>