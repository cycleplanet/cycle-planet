<template>
    <div class="q-pa-md">
        <q-card class="q-pa-md">
          <p class="text-h4">Get inspired</p>
          <p class="text-body1">We're still working on this part, as the Cycle Planet community still has to grow.</p>
          <p class="text-body1">In the mean time, have a look at some of our greatest inspirations:</p>
          <div class="row">

              <q-card v-for="person in persons" :key="person" class="q-mr-md q-mb-md" style="max-width:287px; height:100%" flat bordered>
                <q-card-section horizontal>
                  <q-card-section class="q-pt-xs">
                    <div class="text-overline">{{person.username}}</div>
                    <div class="cp-h2 q-mt-sm q-mb-xs">{{person.name}}</div>
                    <div>
                      <q-img :ratio="16/9"  :src="person.image"/>
                    </div>
                    <div class="text-caption text-grey">{{person.description}}</div>
                  </q-card-section>
                 
                </q-card-section>

                <q-separator />

                <q-card-actions>
                
                  <q-btn flat :style="buttonStyle" @click="openUrl(person.website)">
                    Website
                  </q-btn>
                </q-card-actions>
              </q-card>

          </div>
       
       
       </q-card>
    </div>
</template>

<script>
import mixinGeneral from 'src/mixins/mixin-general.js'
export default {
 mixins: [mixinGeneral],
  data() {
	  	return {
        persons:{
          'heike':{
            name:'Heike Pirngruber',
            username:'Pushbikegirl',
            website:'https://www.pushbikegirl.com/',
            image:'https://static.deutschlandfunknova.de/editorial/Gruenstreifen/_entryImage/191123-heike-pirngruber-thumb.jpg?mtime=20191123114553&focal=none&tmtime=20191123115842',
            description:'Having completed a trip around the world between 2013 and 2017, Pushbikegirl is now an icon in the tour world because of her fabulous writing in which she expresses her most honest feelings. Beside having done some big side trips, she still hasnt seen it all and keeps exploring the world.'
          },
          'iohan':{
            name:'Iohan Gueorguiev',
            username:'Bike Wanderer',
            website:'https://www.bikewanderer.com/about',
            image:'https://images.squarespace-cdn.com/content/v1/5313b211e4b0d7a86d523f91/1525275983015-W8JG9JJR70HK6LF75IH7/ke17ZwdGBToddI8pDm48kFr-MCz83LG2ZqzGFu9uALUUqsxRUqqbr1mOJYKfIPR7LoDQ9mXPOjoJoqy81S2I8N_N4V1vUb5AoIIIbLZhVYxCRW4BPu10St3TBAUQYVKcf42APUzg73I6BbvkUSZBpJhcOgRzHbaVuNgQSOKA8C5AwPhW16geOHSxinwWbjVI/P1120087.jpg?format=500w',
            description:'In his quest to see the world, it took him 5 years to cycle from Alaska to Patagonia. The slower, the better it seems, as Iohan searches for the most remote spots on earth. The magic starts when he takes out his drone, places some very good music and voice overs next to it, and let all bike tourers dream of an epic journey like his.'
          },
          'alastrair':{
            name:'Alastair Humphreys',
            username:'Micro adventures',
            website:'https://alastairhumphreys.com/',
            image:'https://t9r7t4q8.rocketcdn.me/wp-content/uploads/2012/07/alastair-humphreys-profile-01.jpg',
            description:'Cycled around the world from 2001 to 2005 and wrote several amazing books about this journey. He has now become founder of the micro adventures concept and regularly acts as a motivational speaker.'
          },
          'blanca':{
            name:'Blanca',
            username:'Blanca on a bike',
            website:'https://www.blancaonabike.org/',
            image:'http://www.blancaonabike.com/wp-content/uploads/2015/06/IMG_4968.jpg',
            description:'If you still think you cannot cycle alone because it might be too dangerous, meet Blanca, born in 1958. After her trip in Europe and Asia, she headed to Africa, to face the fears that mostly reside in peoples minds. A truly great inspiration!'
          },
          'alee':{
            name:'Alee Denham',
            username:'CyclingAbout',
            website:'https://www.cyclingabout.com/',
            image:'https://d2zxu9tg022395.cloudfront.net/files/9/8/0/6/vlcsnap-2018-04-27-08h54m34s136.jpg',
            description:'Australian guy cycling all around the world, with over 100.000 km of experience across 5 different continents. Among all bike tourers, Alee creates really unique content on his website which become a very usefull resource of information.'
          },
          'ed':{
            name:'Ed Pratt',
            username:'Worldunicycletour',
            website:'https://www.worldunicycletour.com/',
            image:'https://www.worldunicycletour.com/wp-content/uploads/2014/11/DSC022791-1024x683.jpg',
            description:'To cycle around the world is one thing, but to do it on a unicycle you must be even crazier. He left the U.K. as a teenager, and showed the world his adultness as he came in touch with other cultures.'
          },
          'jamie':{
            name:'Jamie McDonald',
            username:'Adventureman',
            website:'https://www.adventureman.org/',
            image:'https://www.adventureman.org/wp-content/uploads/2014/10/SAM-5166.jpg',
            description:'Dressed as a superhero, he calls himself Adventureman. And a hero he is, as he collects money for charity by pushing himself to the limits, in which his debut on the bicycle was nothing compared to his 200 marathon run from coast to coast in the USA.'
          },
          'dervla':{
            name:'Dervla Murphy',
            username:'Pioneer',
            website:'http://www.dervlamurphy.com/',
            image:'https://tr-images.condecdn.net/image/qVlwAm6epRe/crop/1620/f/Dervla-murphy-conde-nast-traveller-23nov16-John-Minihan.jpg',
            description:'Dervla Murphy (born 28 November 1931) is an Irish touring cyclist and author of adventure travel books for over 40 years. She went on a bicycle journey in 1963, from Ireland to India, becoming an inspiration for many.'
          },
          'biciclown':{
            name:'Alvaro Neil',
            username:'Biciclown',
            website:'https://biciclown.com/',
            image:'https://www.pushbikegirl.com/wp-content/uploads/2018/11/Biciclown-Alvaro-Neil-13-years-long-bicycle-tour-1.jpg',
            description:'Alvaro did not only cycle around the world for himself, he also created many smiles on the faces of the poorest kids on our planet, as he performed as a clown along the way.'
          },
        }
      }
   }
}
</script>

<style>

</style>