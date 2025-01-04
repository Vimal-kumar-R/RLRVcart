import React, { useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';

export default function Zooming({ images = [] }) {
    const [currentImage, setCurrentImage] = useState(images[0] || '');

    if (images.length === 0) {
        return <p>No images available</p>;
    }

    const handleHover = (image) => {
        setCurrentImage(image);
    };

    return (
        <div className="zoom">
            <div className="left">
                <div className="left_1">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`thumbnail ${image === currentImage ? 'active' : ''}`}
                            onMouseEnter={() => handleHover(image)}
                        >
                            <img
                                src={image}
                                alt={`Thumbnail ${index + 1}`}
                                style={{ maxHeight: '90px', objectFit: 'contain' }}
                            />
                        </div>
                    ))}
                </div>
                <div className="left_2">
                    <ReactImageMagnify
                        {...{
                            smallImage: {
                                alt: 'Product Image',
                                isFluidWidth: true,
                                src: currentImage,
                            },
                            largeImage: {
                                src: currentImage,
                                width: 1500,
                                height: 1800,
                                right: 300,
                            },
                            enlargedImageContainerDimensions: {
                                width: '170%',
                                height: '140%',
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

