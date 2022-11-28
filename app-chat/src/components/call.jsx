import { useEffect } from 'react';


function Call({ peer }) {
	const makeCall = () => {
		navigator.mediaDevices.getUserMedia(
			{ video: true, audio: true },
			(stream) => {
				const call = peer.call("another-peers-id", stream);
				call.on("stream", (remoteStream) => {
					// Show stream in some <video> element.
				});
			},
			(err) => {
				console.error("Failed to get local stream", err);
			},
		);
	}


}