
import React from 'react';
import { PitchDeckOutput, PitchDeckSlide } from '../types';

interface PrintablePitchDeckProps {
    pitchDeck: PitchDeckOutput | null;
    brandName?: string | null;
}

const Slide: React.FC<{ slide: PitchDeckSlide, brandName?: string | null; totalSlides: number }> = ({ slide, brandName, totalSlides }) => {
    return (
        <div className="h-full flex bg-white text-gray-900 relative overflow-hidden" style={{ width: '1123px', height: '794px' }}>
             {/* Left Column: Text */}
             <div className="w-1/2 p-12 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
                    <span className="text-sm font-bold text-gray-400 tracking-widest uppercase">{brandName || 'Venture Deck'}</span>
                    <span className="text-sm font-bold text-gray-400">{slide.slideNumber} / {totalSlides}</span>
                </div>

                {/* Slide Title */}
                <div className="flex-shrink-0 mb-8">
                    <h2 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">{slide.title}</h2>
                    <div className="w-24 h-2 mt-6 bg-blue-600"></div>
                </div>

                {/* Slide Content */}
                <div className="flex-grow space-y-8 pr-4">
                    {slide.content.map((item, index) => {
                        if (!item.points || item.points.length === 0) {
                            return <p key={index} className="text-2xl text-gray-700 leading-relaxed font-medium">{item.heading}</p>;
                        }
                        return (
                            <div key={index}>
                                {item.heading && <h3 className="font-bold text-2xl text-gray-800 mb-3">{item.heading}</h3>}
                                <ul className="space-y-3">
                                    {item.points.map((point, pIndex) => (
                                        <li key={pIndex} className="flex items-start gap-4">
                                            <span className="mt-2.5 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                                            <span className="text-xl text-gray-600 leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="absolute bottom-12 left-12 text-gray-300 font-bold text-xl select-none">
                    Xinovates
                </div>
            </div>

            {/* Right Column: Image */}
            <div className="w-1/2 h-full relative">
                {slide.imageB64 && (
                    <img 
                        src={`data:image/jpeg;base64,${slide.imageB64}`} 
                        alt="Slide Visual" 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {/* Subtle gradient to ensure edge definition if image is white */}
                <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/5 to-transparent"></div>
            </div>
        </div>
    );
};


const PrintablePitchDeck = React.forwardRef<HTMLDivElement, PrintablePitchDeckProps>(
    ({ pitchDeck, brandName }, ref) => {
        if (!pitchDeck?.slides?.length) {
            return null;
        }

        return (
            <div ref={ref} className="bg-white">
                <div className="flex flex-col">
                    {pitchDeck.slides.map(slide => (
                        <div key={slide.slideNumber} className="break-after-page">
                           <Slide slide={slide} brandName={brandName} totalSlides={pitchDeck.slides.length} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
);

export default PrintablePitchDeck;
