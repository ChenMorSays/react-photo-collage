import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArchive } from '@fortawesome/free-solid-svg-icons'

import {
    ReactPhotoCollageComponent,
} from './react-photo-collage-component';

const createPhotoIds = (photos) => {
    return photos.map((data, i) => {
        return { ...data, id: i }
    });
}
const createLayoutPhotoMaps = (layout, photos) => {
    const newPhotos = createPhotoIds(photos);
    const newMaps = {};
    layout.reduce((accumulator, currentValue, currentIndex) => {
        newMaps[currentIndex] = newPhotos.slice(accumulator, accumulator + currentValue);
        return accumulator + currentValue;
    }, 0);

    return newMaps;

}

interface ReactPhotoCollageContainerProps {
    width?: string;
    height?: Array<string>;
    layout: Array<number>;
    photos: Array<{ src: string }>;
    showNumOfRemainingPhotos?: boolean;
    removePhotoCallback?: (id: string) => void;
}
const checkProps = (props: ReactPhotoCollageContainerProps) => {
    const defaultProps = {
        width: '800px',
        height: new Array(props.layout.length),
        layout: [],
        photos: [],
        showNumOfRemainingPhotos: false,
    }
    const newProps = { ...defaultProps, ...props };
    if (newProps.height.length < newProps.layout.length) {
        for (let i = 0; i < newProps.layout.length; i++) {
            newProps.height[i] = '200px';
        }
    }
    return newProps;
}
const ReactPhotoCollageContainer: React.FC<ReactPhotoCollageContainerProps> = (props) => {
    const currProps = useMemo(() => checkProps(props), [props]);
    const { width, height, layout, photos, showNumOfRemainingPhotos, removePhotoCallback } = currProps;
    const layoutNum = layout.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const [allowRender, setAllowRender] = useState<boolean>(false);
    const [layoutPhotoMaps, setLayoutPhotoMaps] = useState<any>({});
    const [viewerIsOpen, setViewerIsOpen] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<number>(0);
    const [modifiedPhotos, setModifiedPhotos] = useState<Array<{ src: string }>>(photos);
    const remainingNum = modifiedPhotos.length - layoutNum;
    
    useEffect(() => {
        setLayoutPhotoMaps(createLayoutPhotoMaps(layout, modifiedPhotos));
    }, []);
    useEffect(() => {
        Object.keys(layoutPhotoMaps).length ? setAllowRender(true) : setAllowRender(false);
    }, [layoutPhotoMaps]);

    const openLightbox = useCallback((id) => {
        setCurrentImage(parseInt(id));
        setViewerIsOpen(true);
    }, []);
    const closeLightbox = function() {
        setCurrentImage(0);
        setViewerIsOpen(false);
    }
    const closeLightboxCallback = useCallback(closeLightbox, []);

    const removePhoto = function(imageIndex) {
        // Remove locally
        const oldArr = modifiedPhotos;
        const removedPhotoSrc = modifiedPhotos[imageIndex].src;
        oldArr.splice(imageIndex, 1);
        setModifiedPhotos(oldArr);
        setLayoutPhotoMaps(createLayoutPhotoMaps(layout, oldArr));
        
        // Update parent component
        removePhotoCallback(removedPhotoSrc)

        if (oldArr.length == 0) {
            closeLightbox()
        } else {
            setCurrentImage((currentImage + 1) % modifiedPhotos.length)
        }
    }

    if (allowRender) {
        return (
            <React.Fragment>
                <ReactPhotoCollageComponent
                    width={width}
                    height={height}
                    layout={layout}
                    layoutPhotoMaps={layoutPhotoMaps}
                    layoutNum={layoutNum}
                    remainingNum={remainingNum}
                    showNumOfRemainingPhotos={showNumOfRemainingPhotos}
                    openLightbox={openLightbox}
                />
                {
                        viewerIsOpen ?
                            (<Lightbox
                                mainSrc={modifiedPhotos[currentImage].src}
                                nextSrc={modifiedPhotos[(currentImage + 1) % modifiedPhotos.length].src}
                                prevSrc={modifiedPhotos[(currentImage + modifiedPhotos.length - 1) % modifiedPhotos.length].src}
                                onCloseRequest={closeLightboxCallback}
                                toolbarButtons={[
                                    <FontAwesomeIcon icon={faArchive} onClick={() => removePhoto(currentImage)} style={{marginRight: `10px`}} className="ril__toolbarItemChild ril__builtinButton"></FontAwesomeIcon>
                                ]}
                                onMovePrevRequest={() => setCurrentImage((currentImage + modifiedPhotos.length - 1) % modifiedPhotos.length)}
                                onMoveNextRequest={() => setCurrentImage((currentImage + 1) % modifiedPhotos.length)}
                            />
                            ) : null
                    }
            </React.Fragment>
        );
    }

    return null;
};

export default ReactPhotoCollageContainer;