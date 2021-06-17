<template>
	<div class=" q-gutter-sm">
		<p class="cp-h2">Description:</p>
		<div class="">You have to use at least 50 characters</div>
			<q-editor
			@paste.native="evt => pasteCapture(evt)"
			ref="editor_ref"
			v-model="editor"
			@input="$emit('update:description', $event)"
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
import { selectAll } from 'src/directives/directive-select-all'

	export default {
		props: ['description'],
		directives: {
			selectAll
		},
		data () {
			return {
			editor: ''
			}
		},
		methods:{
			pasteCapture (evt) {
			// Let inputs do their thing, so we don't break pasting of links.
			if (evt.target.nodeName === 'INPUT') return
			let text, onPasteStripFormattingIEPaste
			evt.preventDefault()
			if (evt.originalEvent && evt.originalEvent.clipboardData.getData) {
			  text = evt.originalEvent.clipboardData.getData('text/plain')
			  this.$refs.editor_ref.runCmd('insertText', text)
			}
			else if (evt.clipboardData && evt.clipboardData.getData) {
			  text = evt.clipboardData.getData('text/plain')
			  this.$refs.editor_ref.runCmd('insertText', text)
			}
			else if (window.clipboardData && window.clipboardData.getData) {
			  if (!onPasteStripFormattingIEPaste) {
				onPasteStripFormattingIEPaste = true
				this.$refs.editor_ref.runCmd('ms-pasteTextOnly', text)
			  }
			  onPasteStripFormattingIEPaste = false
			}
		},
		}
	}
</script>