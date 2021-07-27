<template>
<div>
    <div v-if="tripActive && myProfile &&storyData.country" class="q-pa-md q-mb-lg" style="max-width:450px">
        <div class="row" :class="isWebApp?'cp-h2 ':'text-h6'">{{storyData.country}}, {{storyData.place}}
            <div class="circle pulse q-ma-sm"></div>
        </div>
        <q-btn :style="buttonStyle" @click="addStoryDialog=true">Add story</q-btn>
    </div> 
    
    <div v-if="tripDetails.stories">
        <q-card v-for="(story, storyId, index) in tripDetails.stories" :key="storyId" >
            <div class="q-pa-md ">
            <q-btn flat dense round icon="edit" @click="editStoryMethod(story, storyId)" class="absolute-top-right q-pa-sm" v-if="myProfile"/>

            <div class="no-margin" :class="isWebApp?'cp-h2':'text-h6'">{{story.title}}</div>

            <div class="text-grey q-gutter-x-sm row flex items-center">
                <nice-date2 :dateprop="storyId" />
                <div class="q-mx-sm">•</div>
                <div><modal-countrychip2 :countryKey="story.country"/></div>
            </div>

            <q-separator class="q-my-md"/>

            <q-item-label class="text-body1"><div v-html="story.story"/></q-item-label>

            </div>

        </q-card>
    </div>

    <div v-else>
        <div v-if="myProfile">
            <div v-if="tripActive">
                Let the world know how your first days have been!
            </div>
            <div v-else>
                You have no stories yet. You can add your first story when your trip started.
            </div>
        </div>

        <div v-else>
          {{users[userId].fullname}} has no stories yet.
        </div>
    </div>

    
    <q-dialog :maximized="!isWebApp" v-model="addStoryDialog" @close="addStoryDialog=false" >
      <q-card style="width:80%;max-width:500px;" class="no-padding">
         
        <modal-header>Add story</modal-header>
        <div class="q-pa-md q-gutter-y-sm">
          <div class="cp-h2">{{storyData.country}}, {{storyData.place}}</div>
          <div class="text-italic">{{storyData.coordinates.lat}}, {{storyData.coordinates.lng}}</div>
          <q-input label="Title" filled v-model="storyData.title"></q-input>
          <div class="text-bold">Description:</div>
		 
          <q-editor
          @paste.native="evt => pasteCapture(evt)"
          ref="editor_ref"
          v-model="storyData.story"
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
        <q-btn :style="buttonStyle" @click="saveStory()">save</q-btn>
        </div>
        <div>
         

        </div>
      </q-card>
    </q-dialog>

      <q-dialog :maximized="!isWebApp" v-model="editStoryDialog" @close="addStoryDialog=false" v-if="editStoryData">
      <q-card style="min-width:40%;" class="" v-if="editStoryData.story">
        <modal-header>Edit story</modal-header>
        <div class="q-pa-md q-gutter-y-sm">
          <div class="cp-h2">{{editStoryData.story.country}}, {{editStoryData.story.place}}</div>
          <div class="text-italic">{{editStoryData.story.coordinates.lat}}, {{editStoryData.story.coordinates.lng}}</div>
          <q-input label="Title" filled v-model="editStoryData.story.title"></q-input>
          <div class="text-bold">Description:</div>
		 
          <q-editor
          @paste.native="evt => pasteCapture(evt)"
          ref="editor_ref"
          v-model="editStoryData.story.story"
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
        <q-btn :style="buttonStyle" @click="saveEditStory()">save</q-btn>
        </div>
        <div>
         

        </div>
      </q-card>
    </q-dialog>



    
</div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
import mixinTrip from 'src/mixins/mixin-trip.js'

export default {
  mixins: [mixinGeneral, mixinTrip ],

  data () {
      return {
          addStoryDialog:false,
          editStoryData:{},
          editStoryDialog:false,
      }
  },
}
</script>

<style>

</style>