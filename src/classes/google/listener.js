const { Writable } = require("node:stream");

const speech = require("@google-cloud/speech").v1p1beta1;
const microphone = require('node-record-lpcm16');

module.exports = class Listener {
	constructor(credentials) {
		this.client = new speech.SpeechClient({ credentials });
	}

	async transcribe(data, languageCode = "ja-JP", encoding = null, sampleRateHertz = 44100){
		const [response] = await listener.recognize({
			config: { sampleRateHertz, languageCode, enableWordConfidence: true, enableAutomaticPunctuation: true },
			audio: { content: data }
		});
	
		const transcriptions = response.results.map(x => x.alternatives);
		return transcriptions;
	}

	async transcribeStream(languageCode = "ja-JP", sampleRateHertz = 16000){
		const upstream = this.client.streamingRecognize({
			config: { encoding: "LINEAR16", sampleRateHertz, languageCode, enableWordConfidence: true, enableAutomaticPunctuation: true },
			interimResults: true
		});
	
		upstream.on("error", error => console.log(error));
	
		upstream.on("data", data => {
			//console.log(JSON.stringify(data, 0, 2));
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(data["results"][0]["alternatives"][0]["words"].map(word => {
				let hue = 125 * ((word.confidence - 0.7) * 3.33);
				hue = hue < 0 ? 0 : (hue > 125 ? 125 : hue);
				return chalk.hsv(Math.round(hue), 100, 100)(word.word);
			}).join(" "));
		});
	
		return upstream;
	}

	async record(endCallback, errorCallback){
		const upstream = await this.transcribeStream("en-AU");
	
		const transform = new Writable({
			write(chunk, encoding, next){
				upstream.write(chunk);
				next();
			}
		});
	
		// microphone.record({ 
		// 	sampleRateHertz: 16000, 
		// 	//threshold: 0, 
		// 	thresholdStart: 0.2,
		// 	thresholdEnd: 0.8,
		// 	silence: '1.0', 
		// 	endOnSilence: true,
		// 	keepSilence: false, 
		// 	recordProgram: "rec"
		// })
		// .stream()
		// .on("error", error => errorCallback(error))
		// .on("end", () => {
		// 	endCallback();
		// 	//upstream.end();
		// 	//record();
		// })
		// .pipe(transform);
	}
}