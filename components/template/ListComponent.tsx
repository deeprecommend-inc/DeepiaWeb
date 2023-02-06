import React, { useCallback, useState } from 'react';
import {
    DragDropContext,
    Draggable,
    DraggableLocation,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import { css } from '@emotion/react';
import tw from 'twin.macro';

const listStyle = css`
    ${tw`mb-3`}
    :last-of-type {
        ${tw`mb-0`}
    }
`;
const listTitleStyle = css`
    ${tw`relative py-1 border border-black text-red-500`}
`;
const openBtnStyle = css`
    ${tw`absolute inset-y-auto right-2 rounded text-xl leading-5 text-black cursor-pointer select-none`}
`;
const itemsStyle = css`
    ${tw`p-1 border border-black`}
    + div {
        display: none !important;
    }
`;
const itemStyle = css`
    ${tw`px-2 py-1 mb-1 rounded bg-blue-500 text-white`}
    :last-child {
        ${tw`mb-0`}
    }
`;
const copyStyle = css`
    ${itemStyle};
    ${tw`px-2 py-1 mb-1 rounded bg-blue-500 text-white`}/* + div {
    display: none !important;
  } */
`;

// 型定義
type Item = {
    id: string;
    text: string;
};
type List = {
    id: string;
    title: string;
    items: Item[];
};

type Props = {
    list: List;
    listIndex: number;
};

export const ListComponent: React.FC<Props> = ({ list, listIndex }) => {
    /**
     * ステート
     */
    const [openList, setOpenList] = useState(false);
    const [arrow, setArrow] = useState('▼');

    const toggleList = useCallback(() => {
        const flag = !openList;
        setOpenList(flag);
        if (flag) {
            setArrow('▲');
        } else {
            setArrow('▼');
        }
    }, [openList]);

    return (
        <Droppable
            key={list.id}
            droppableId={`items${listIndex}`}
            isDropDisabled={true}
        >
            {(provided, snapshot) => (
                <div
                    css={listStyle}
                    ref={provided.innerRef}
                    // isDrappingOver={snapshot.isDraggingOver}
                >
                    <div css={listTitleStyle}>
                        {list.title}
                        <span css={openBtnStyle} onClick={() => toggleList()}>
                            {arrow}
                        </span>
                    </div>
                    {openList ? (
                        <div css={itemsStyle}>
                            {list.items.map((item, itemIndex) => {
                                return (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={itemIndex}
                                    >
                                        {(provided, snapshot) => (
                                            <React.Fragment>
                                                <div
                                                    css={itemStyle}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    // isDragging={snapshot.isDragging}
                                                    style={
                                                        provided.draggableProps
                                                            .style
                                                    }
                                                >
                                                    {item.text}
                                                </div>
                                                {snapshot.isDragging && (
                                                    <div css={copyStyle}>
                                                        {item.text}
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        )}
                                    </Draggable>
                                );
                            })}
                        </div>
                    ) : null}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};
