import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
} from 'react-grid-dnd';
import react, { useState } from 'react';

export function Example() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'test' },
        { id: 2, name: 'test' },
        { id: 3, name: 'test' },
        { id: 4, name: 'test' },
    ]); // supply your own state

    // target id will only be set if dragging from one dropzone to another.
    function onChange(sourceId, sourceIndex, targetIndex, targetId) {
        const nextState = swap(categories, sourceIndex, targetIndex);
        setCategories(nextState);
    }

    return (
        <GridContextProvider onChange={onChange}>
            <GridDropZone
                id="items"
                boxesPerRow={4}
                rowHeight={100}
                style={{ height: '400px' }}
            >
                {categories.map((category) => (
                    <GridItem key={category.id}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                            }}
                        >
                            {category.name}
                        </div>
                    </GridItem>
                ))}
            </GridDropZone>
        </GridContextProvider>
    );
}
