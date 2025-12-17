
import React, { useState } from 'react';
import { PitchDeckOutput, PitchDeckSlide } from '../types';
import { ChevronRightIcon, PresentationChartBarIcon, DocumentTextIcon, FilmIcon } from './Icons';

interface PitchDeckViewProps {
    pitchDeck: PitchDeckOutput;
    brandName?: string | null;
}

const SlideContent: React.FC<{ slide: PitchDeckSlide, brandName?: string | null }> = ({ slide, brandName }) => {
    return (
        <div className="w-full h-full bg-white text-gray-800 flex overflow-hidden">
            {/* Left Side: Content */}
            <div className="w-1/2 p-8 sm:p-12 flex flex-col relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-8">
                    <span>{brandName || 'Venture Plan'}</span>
                    <span>{slide.slideNumber < 10 ? `0${slide.slideNumber}` : slide.slideNumber}</span>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{slide.title}</h2>
                    <div className="w-20 h-1.5 mt-4 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                </div>

                {/* Text Content */}
                <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                    {slide.content.map((item, idx) => (
                        <div key={idx}>
                            {item.heading && <h3 className="text-xl font-bold text-gray-700 mb-2">{item.heading}</h3>}
                            {item.points && item.points.length > 0 && (
                                <ul className="space-y-2">
                                    {item.points.map((point, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-3 text-base text-gray-600 leading-relaxed">
                                            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side: Image */}
            <div className="w-1/2 bg-gray-100 relative overflow-hidden">
                {slide.imageB64 ? (
                    <img 
                        src={`data:image/jpeg;base64,${slide.imageB64}`} 
                        alt={`Visual for ${slide.title}`} 
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-2">
                        <FilmIcon className="w-12 h-12 opacity-50" />
                        <span className="text-sm">Generating visual...</span>
                    </div>
                )}
                {/* Overlay Gradient for Text Readability if we were overlapping, but here distinct sections looks cleaner */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

const PitchDeckView: React.FC<PitchDeckViewProps> = ({ pitchDeck, brandName }) => {
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const nextSlide = () => {
        if (currentSlideIndex < pitchDeck.slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
        }
    };

    const currentSlide = pitchDeck.slides[currentSlideIndex];

    return (
        <div className="flex flex-col items-center animate-fade-in">
            {/* Toolbar / Progress */}
            <div className="w-full max-w-6xl flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2 text-white">
                    <PresentationChartBarIcon className="w-5 h-5 text-blue-400" />
                    <span className="font-semibold">Investor Deck</span>
                </div>
                <div className="text-sm text-gray-400">
                    Slide {currentSlideIndex + 1} of {pitchDeck.slides.length}
                </div>
            </div>

            {/* Main Slide Viewer (16:9 Aspect Ratio Container) */}
            <div className="w-full max-w-6xl aspect-video bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700 relative group">
                <SlideContent slide={currentSlide} brandName={brandName} />
                
                {/* Navigation Overlays */}
                <button 
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="absolute left-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-center bg-gradient-to-r from-black/20 to-transparent hover:from-black/40 transition-all opacity-0 group-hover:opacity-100 disabled:hidden focus:opacity-100 z-20"
                >
                    <ChevronRightIcon className="w-10 h-10 text-white rotate-180 drop-shadow-lg" />
                </button>
                <button 
                    onClick={nextSlide}
                    disabled={currentSlideIndex === pitchDeck.slides.length - 1}
                    className="absolute right-0 top-0 bottom-0 w-16 md:w-24 flex items-center justify-center bg-gradient-to-l from-black/20 to-transparent hover:from-black/40 transition-all opacity-0 group-hover:opacity-100 disabled:hidden focus:opacity-100 z-20"
                >
                    <ChevronRightIcon className="w-10 h-10 text-white drop-shadow-lg" />
                </button>
            </div>

            {/* Slide Thumbnails / Navigation Dots */}
            <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-4xl">
                {pitchDeck.slides.map((slide, idx) => (
                    <button
                        key={slide.slideNumber}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlideIndex ? 'bg-blue-500 w-8' : 'bg-gray-600 hover:bg-gray-500'}`}
                        title={slide.title}
                    />
                ))}
            </div>
            
            {/* Executive Summary Section (Below Deck) */}
            <div className="w-full max-w-6xl mt-12 bg-gray-900/50 border themed-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                    Executive Summary
                </h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {pitchDeck.executiveSummary}
                </p>
            </div>
        </div>
    );
};

export default PitchDeckView;
