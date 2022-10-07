import React, { useState, useEffect, useRef } from "react";

const Participant = ({ participant, isOwner }) => {
    // const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);
    const [isAudioMute, setIsAudioMute] = useState(false);

    // const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = (trackMap) =>
        Array.from(trackMap.values())
            .map((publication) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {
        // setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        const trackSubscribed = (track) => {
            // if (track.kind === "video") {
            //     setVideoTracks((videoTracks) => [...videoTracks, track]);
            // } else 
            if (track.kind === "audio") {
                setAudioTracks((audioTracks) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track) => {
            // if (track.kind === "video") {
            //     setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
            // } else
            if (track.kind === "audio") {
                setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
            }
        };

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            // setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    // useEffect(() => {
    //     const videoTrack = videoTracks[0];
    //     if (videoTrack) {
    //         videoTrack.attach(videoRef.current);
    //         return () => {
    //             videoTrack.detach();
    //         };
    //     }
    // }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    const muteAudio = () => {
        setIsAudioMute(!isAudioMute)
        if (isAudioMute) {

            participant.audioTracks.forEach(track => {
                console.log(track);
                track.track.enable();
            });

        }
        else {
            participant.audioTracks.forEach(track => {
                console.log(track);
                console.log("participant", participant);
                track.track.disable();
            });
        }
    }

    return (
        <div className="participant" onClick={muteAudio}  >
            <h3>{participant.identity}</h3>
            {/* <video ref={videoRef} controls autoPlay={true} /> */}
            {!isOwner && <audio ref={audioRef} autoPlay={true} muted={false} />}
            {isOwner && <button >{isAudioMute ? "mute" : "unMute"}</button>}
        </div>
    );
};

export default Participant;
