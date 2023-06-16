export default {
    name: 'RecorderUtil',
    data() {
        return {
            recording: false,
            audioChunks: [],
            mediaRecorder: null,
        };
    },
    props: {
        rounds: 0,
        topic: '',
    },
    methods: {
        startRecording() {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.mediaRecorder.addEventListener('dataavailable', event => {
                  if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                  }
                });
                this.mediaRecorder.start();
                this.recording = true;
              })
              .catch(error => {
                console.error('Error accessing microphone:', error);
              });
          },
          stopRecording() {
            this.mediaRecorder.stop();
            this.recording = false;
            return new Blob(this.audioChunks, { type: 'audio/wav' });
          },
    }
};