<script setup>
import api from "../../api/api";
import axios from "axios";
import FileDownload from "js-file-download";
import { saveAs } from "file-saver";

import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Swal from "sweetalert2";
import moment from "moment";

import { showFlashMessage } from "../../function/flashMessage.js";
</script>

<template>
  <div class="container-div">
    <div class="input-fields-container">
      <div class="form-input-label">

        <div class="input-field">
          <label for="" class="input-label">Date Time From</label>
          <div class="datetime-picker-container">
            <flat-pickr
              v-model="callSearch.dateFrom"
              :config="dateTimePickerConfig_from"
              class="input"
            ></flat-pickr>
            <font-awesome-icon :icon="['fas', 'calendar-alt']" class="calendar-icon" />
          </div>
        </div>

        <div class="input-field">
          <label for="" class="input-label">Date Time To</label>
          <div class="datetime-picker-container">
            <flat-pickr
              v-model="callSearch.dateTo"
              :config="dateTimePickerConfig_to"
              class="input"
            ></flat-pickr>
            <font-awesome-icon :icon="['fas', 'calendar-alt']" class="calendar-icon" />
          </div>
        </div>

        <div class="input-field">
          <label for="" class="input-labels">Agent</label>
          <div class="input-box-container">
            <input class="input" type="text" v-model="callSearch.agentName" />
          </div>
        </div>

        <div class="input-field">
          <label for="" class="input-labels">Phone</label>
          <div class="input-box-container">
            <input class="input" type="text" v-model="callSearch.phoneNumber" />
          </div>
        </div>

        <div class="input-field">
          <label for="" class="input-labels">Call ID</label>
          <div class="input-box-container">
            <input class="input" type="text" v-model="callSearch.callId" />
          </div>
        </div>
      </div>
    </div>

    <div class="buttons-container">
      <button class="button button_search_clear" @click="clearSearchAndData">
        Clear
      </button>
      <button class="button button_search_clear" @click="searchCallRecords">
        Search
      </button>
    </div>
    <br /><br />
    <div class="table-container">
      <v-table fixed-header height="60vh" class="table" id="results-table">
        <div></div>
        <thead>
          <tr>
            <th>Num</th>
            <th>Call ID</th>
            <th>Date Time</th>
            <th>Agent</th>
            <th>Phone(From)</th>
            <th>Phone(To)</th>
            <th>Play</th>
            <th>Save</th>
            <th>Call Recording File</th>
          </tr>
        </thead>
        <tbody v-if="calls.length > 0">
          <tr v-for="(call, index) in calls" :key="call.callId">
            <td style="text-align: right">{{ index + 1 }}</td>
            <td>{{ call.callId }}</td>
            <td>{{ readDate(call.date) }}</td>
            <td>{{ call.agentName }}</td>
            <td>{{ call.inboundNo }}</td>
            <td>{{ call.outboundNo }}</td>
            <td class="play-button">
              <div v-if="call.callRecordingLink">
                <button
                  v-if="soundPlayerStatus === 'playing' && current_playing === 'none'"
                  @click="
                    playSound(
                      `/dynamic-folder/${call.callRecordingLink}`,
                      call.callRecordingLink
                    )
                  "
                  :id="call.callRecordingLink"
                >
                  <font-awesome-icon :icon="['fas', 'play']" />
                </button>

                <button
                  v-if="soundPlayerStatus === 'pause'"
                  @click="pauseSound(`/dynamic-folder/${call.callRecordingLink}`)"
                  :id="call.callRecordingLink"
                >
                  <div v-if="current_playing === call.callRecordingLink">
                    <font-awesome-icon :icon="['fas', 'pause']" />
                  </div>
                  <div v-else>
                    <font-awesome-icon :icon="['fas', 'play']" />
                  </div>
                </button>
              </div>
            </td>
            <td>
              <button class="download-button" v-if="call.callRecordingLink">
                <a
                  :href="`/dynamic-folder/${call.callRecordingLink}`"
                  :download="call.callRecordingLink"
                  target="_blank"
                  style="color: #000"
                >
                  <img
                    src="./../../assets/viber_image_2023-12-12_08-38-41-744.png"
                    alt="Download_icon"
                    width="30"
                    height="30"
                  />
                </a>
              </button>
            </td>
            <td>{{ call.callRecordingLink }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    flatPickr,
  },
  data: () => ({
    dateTimePickerConfig_from: {
      enableTime: true,
      dateFormat: "Y-m-d H:i:S",
      time_24hr: true,
      defaultHour: 0,
      defaultMinute: 0,
      defaultSecond: 0,
    },
    dateTimePickerConfig_to: {
      enableTime: true,
      dateFormat: "Y-m-d H:i:S",
      time_24hr: true,
      defaultHour: 23,
      defaultMinute: 59,
      defaultSecond: 59,
    },
    calls: [],
    callSearch: {
      dateFrom: "",
      dateTo: "",
      agentName: "",
      phoneNumber: "",
      callId: "",
      callRecordingLink: "",
    },
    soundPlayer: "",
    soundPlayerStatus: "playing",
    current_playing: "none",
    brandData: {
      header_text_color: "#FFFFFF",
      header_text_size: "14px",
      header_bg_color: "#fff",
      footer_text_color: "#FFFFFF",
      footer_text_size: "14px",
      footer_bg_color: "#fff",
      main_color1: "#0090D1",
      main_color2: "#0090D1",
      main_color3: "#0090D1",
      accent_color1: "#0090D1",
      button_text_color: "#FFFFFF",
      font_text_color: "#54575B",
      font: "Open Sans",
      font_title_size: "27px",
    },
  }),

  methods: {
    async showSweetAlert(message) {
      Swal.fire({
        text: message,
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "#A4CB37",
        confirmButtonText: "Ok",
      }).then((result) => {
        if (result.isConfirmed) {
        }
      });
    },

    // Vue component
    async playSound(sound, callRecordingLink) {
      if (sound) {
        const fullURL = `${window.location.origin}${sound}`;
        console.log("fullURL", fullURL);
        this.soundPlayer = new Audio(fullURL);
        // this.soundPlayer = new Audio(sound);
        this.soundPlayer.play();
        this.soundPlayerStatus = "pause";
        this.current_playing = callRecordingLink;
      }
    },

    async pauseSound(sound) {
      // Pause the audio
      this.soundPlayer.pause(sound);
      this.soundPlayerStatus = "playing";
      this.current_playing = "none";
    },

    async downloadAudio(callUrl) {
      const audio = this.$refs.audioPlayer;
      const downloadLink = document.createElement("a");
      downloadLink.href = callUrl;
      console.log(audio);
      console.log(downloadLink.href);
      downloadLink.download = `${callUrl}.mp3`;
      downloadLink.click();
    },

    readDate(data) {
      //
      console.log("date from database", data);
      return moment(data).utc().format("YYYY-MM-DD HH:mm:ss");
    },
    newTabFunction() {
      const w = window.open();
      const html = document.getElementById("newTab").innerHTML;

      if (w) {
        w.document.body.innerHTML = html;
      } else {
        alert("Popup blocker may be preventing opening a new tab.");
      }
    },

    hasInputCriteria() {
      return (
        this.callSearch.dateFrom ||
        this.callSearch.dateTo ||
        this.callSearch.agentName ||
        this.callSearch.phoneNumber ||
        this.callSearch.callId
      );
    },

    async searchCallRecords() {
      // Resetting sound player status and current playing
      this.soundPlayerStatus = "playing";
      this.current_playing = "none";
      if (this.soundPlayer) {
        this.soundPlayer.pause();
      }

      try {
        // Making the API call
        const result = await api.post("call-recordings", this.callSearch);

        console.log("this.callSearch", this.callSearch);
        console.log(result.data);

        result.data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const numRows = result.data.length;
        const displayedRows = Math.min(numRows, 1000);
        this.calls = result.data.slice(0, displayedRows);

        const message =
          numRows > 0
            ? ` ${numRows} calls found. Displaying the first ${displayedRows}.` +
              (this.hasInputCriteria() ? "" : " Please refine your search.")
            : "No matching records found." +
              (this.hasInputCriteria() ? "" : " Please refine your search.");

        showFlashMessage(message);
      } catch (error) {
        console.error("Error fetching call records:", error);
        showFlashMessage("Error fetching call records. Please try again.");
      }
    },

    clearSearchAndData() {
      (this.calls = []),
        (this.callSearch = {
          dateFrom: "",
          dateTo: "",
          agentName: "",
          phoneNumber: "",
          callId: "",
          callRecordingLink: "",
        });
    },
  },
};
</script>

<style scoped>
@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(0);
  }
  40% {
    transform: translateX(10px);
  }
  60% {
    transform: translateX(5px);
  }
}

.flash-message {
  animation: bounce 1s ease;
  /* Add the following line to ensure the animation restarts on each appearance */
  animation-fill-mode: forwards;
}

.buttons-container {
  display: flex;
  justify-content: flex-start;
  padding: 10px 0 0 25px;
}

.button {
  background-color: #a4cb37;
  width: 10%;
  box-shadow: 0px 2px 10px -4px #000000;
  margin-right: 58px;
  font-weight: bold;
}

.button_search_clear {
  display: inline-block;
  min-width: 80px;
  margin-left: -40px; /* Adjust the margin for the second button */
}

.button:active {
  background: #bfbfbf;
  -webkit-box-shadow: inset 0px 0px 5px #bfbfbf;
  -moz-box-shadow: inset 0px 0px 5px #bfbfbf;
  box-shadow: inset 0px 0px 5px #bfbfbf;
  outline: none;
}

.button:focus {
  outline: none;
}
.input-label {
  text-align: left;
  padding: 0 10px 0 10px;
}

.input-labels {
  text-align: left;
  padding: 0 10px 0 10px;
}

.input {
  box-shadow: 0px 2px 5px -4px rgb(206, 88, 88);
  height: 40px;
  min-width: 100%;
  font-size: 20px;
  padding: 0 10px 0 10px;
  border-radius: 5px;
  border-style: solid;
  flex: 2;
}

.inputs {
  box-shadow: 0px 2px 5px -4px rgb(206, 88, 88);
  height: 40px;
  font-size: 20px;
  padding: 0 10px 0 10px;
  border-radius: 5px;
  border-style: solid;
  flex: 2;
  margin-right: 150px;
}
.input-field {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  justify-content: flex-end;
  width: 100%;
}
.datetime-picker-container {
  position: relative;
}

.input-box-container {
  position: relative;
}

.calendar-icon {
  position: absolute;
  top: 50%;
  right: 15px;
  transform: translateY(-50%);
  font-size: 20px;
}

.container-div {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center items horizontally */
  text-align: center;
}

.heading-title {
  font-weight: bold;
  margin: 10px 0 0 0;
  font-size: 2em;
}

.heading-title-result {
  font-weight: bold;
  margin: 50px 0 50px 0;
}

.search-criteria-container {
  display: flex;
  justify-content: flex-start;
  padding: 4vh 0 4vh 7vw;
}

.search-criteria-label {
  font-size: 1.5em;
}

.input-fields-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.form-input {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 0 20px;
  width: 35%;
}

/*.input {
  flex: 2;
}*/

.form-input-label {
  display: flex;
  flex-direction: column;
  font-size: 18px;
}

.download-button {
  background: none;
  width: 100%;
  font-weight: bold;
  padding: 0;
}

.download-button:focus {
  outline: none;
  box-shadow: none;
}

.table-container {
  display: flex;
  justify-content: center;
  min-width: 90%;
}

#results-table {
  min-width: 90%;
  border-collapse: collapse;
  table-layout: fixed;
}

#results-table td,
#results-table th {
  border: 1px solid #fff;
  padding: 6px;
  height: auto;
  text-align: left;
}

#results-table th {
  font-weight: bold;
  background-color: #ddd;
}

#results-table td {
  border: 1px solid #ddd;
  word-wrap: break-word;
}

#results-table tr:nth-child(even) {
  background-color: #e1e1e1;
}

#results-table tr:nth-child(odd) {
  background-color: #fff;
}

.play-button {
  width: 1%;
}
</style>
