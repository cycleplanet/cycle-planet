<template>
    <div class="bg-white">
        <modal-header>My requests</modal-header>
        <q-tabs v-model="tab" dense class="text-grey" active-color="secondary" indicator-color="secondary" align="justify" >
            <q-tab name="current" label="Current" />
            <q-tab name="history" label="History" />
        </q-tabs>
        <q-separator />

        <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="current" class="bg-grey-2">
                <div v-if=" myUserDetails.hosting.requests?(Object.keys(requestsSend).length||Object.keys(requestsReceived).length||Object.keys(requestsNeedFeedback).length):false">
                    
                    <div class="text-h6 q-my-md" :style="isWebApp?'width:500px':'width:300px'">Host requests received ({{Object.keys(requestsReceived).length}})</div>

                    <q-list bordered separator v-if="requestsReceived">
                        <q-item v-for="(bool, requestkey) in requestsReceived" :key="requestkey" class="no-padding bg-white">
                            <q-expansion-item style="width:100%">
                                <template v-slot:header>
                                    <q-item-section>
                                        <q-item-label class="row">
                                            <modal-username2 :userId="myUserDetails.hosting.requests[requestkey].sender"/>
                                            <q-icon name="arrow_forward" />
                                            <modal-username2 :userId="myUserDetails.hosting.requests[requestkey].receiver"/></q-item-label>
                                        <q-item-label caption></q-item-label>
                                    </q-item-section>
                                    <q-item-section side >
                                        <div>{{myUserDetails.hosting.requests[requestkey].dateProposal}}</div>
                                        <q-chip :class="myUserDetails.hosting.requests[requestkey].status==='accepted'?'bg-green-3':(myUserDetails.hosting.requests[requestkey].status==='refused'?'bg-red-3':'')">{{myUserDetails.hosting.requests[requestkey].status}}</q-chip>
                                    </q-item-section>
                                </template>
                                <request-received :requestkey="requestkey"/>
                            </q-expansion-item>
                        </q-item>
                    </q-list>

                    <div class="text-h6 q-my-md" >Requests sent ({{Object.keys(requestsSend).length}})</div>
                    <q-list bordered separator v-if="myUserDetails.hosting.requests">
                        <q-item v-for="(bool, requestkey) in requestsSend" :key="requestkey" class="no-padding bg-white">
                            <q-expansion-item style="width:100%">
                                <template v-slot:header>
                                    <q-item-section>
                                        <q-item-label class="row">
                                            <modal-username2 :userId="myUserDetails.hosting.requests[requestkey].sender"/>
                                            <q-icon name="arrow_forward" />
                                            <modal-username2 :userId="myUserDetails.hosting.requests[requestkey].receiver"/></q-item-label>
                                        <q-item-label caption></q-item-label>
                                    </q-item-section>
                                    <q-item-section side >
                                        <div>{{myUserDetails.hosting.requests[requestkey].dateProposal}}</div>
                                        <q-chip :class="myUserDetails.hosting.requests[requestkey].status==='accepted'?'bg-green-3':(myUserDetails.hosting.requests[requestkey].status==='refused'?'bg-red-3':'')">{{myUserDetails.hosting.requests[requestkey].status}}</q-chip>
                                    </q-item-section>
                                </template>
                                <request-send :requestkey="requestkey"/>
                            </q-expansion-item>
                        </q-item>
                    </q-list>
                    <!-- <q-list v-for="(bool, requestkey) in requestsSend" :key="requestkey">
                        <request-send :requestkey="requestkey" v-if="requestsSend && myUserDetails.hosting.requests[requestkey].from==='me'" />
                    </q-list> -->

                    <div class="text-h6 q-my-md">Waiting for feedback ({{Object.keys(requestsNeedFeedback).length}})</div>
                    <q-list v-for="(bool, requestkey) in requestsNeedFeedback" :key="requestkey">
                        <request-need-feedback :requestkey="requestkey" v-if="requestsNeedFeedback&&daysToGo(myUserDetails.hosting.requests[requestkey].dateProposal)<0&&myUserDetails.hosting.requests[requestkey].status==='accepted'&&!myUserDetails.hosting.requests[requestkey].wroteFeedback"/>
                    </q-list>
                </div>
                
                <div v-else>There are no host requests to display  </div>
            </q-tab-panel>

            <q-tab-panel  name="history">
                <q-list bordered separator v-if="myUserDetails.hosting.requests">
                    <q-item v-for="request in myUserDetails.hosting.requests" :key="request">
                        <q-item-section>
                            <q-item-label class="row">
                                <modal-username2 :userId="request.sender"/>
                                <q-icon name="arrow_forward" />
                                <modal-username2 :userId="request.receiver"/></q-item-label>
                            <q-item-label caption></q-item-label>
                        </q-item-section>
                        <q-item-section side class="justify-center">
                            <div>{{request.dateProposal}}</div>
                            <q-chip :class="request.status==='accepted'?'bg-green-3':(request.status==='refused'?'bg-red-3':'')">{{request.status}}</q-chip>
                        </q-item-section>
                    </q-item>
                </q-list>
                <div v-if="!myUserDetails.hosting.requests">There are no host requests to display</div>
            </q-tab-panel>
        </q-tab-panels>
    </div>
</template>

<script>
    import { date } from 'quasar'
    import mixinGeneral from 'src/mixins/mixin-general.js'
    import mixinHosting from 'src/mixins/mixin-hosting.js'
    import { mapState, mapActions, mapGetters } from 'vuex'


    export default {
        mixins: [mixinGeneral, mixinHosting],
        data() {
            return {
                tab:'current',
            }
        },
        components:{
            'request-send': require('components/Profile/Requests/Send.vue').default,
            'request-received': require('components/Profile/Requests/Received.vue').default,
            'request-need-feedback': require('components/Profile/Requests/NeedFeedback.vue').default,

        },

        
        methods:{
           
        }

    }
    </script>

    <style>

    </style>