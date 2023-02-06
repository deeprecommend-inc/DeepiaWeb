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
import { ListComponent } from './ListComponent';

// エリア
const dragDropContext = css`
    ${tw`flex justify-center items-start mt-3 text-center`}
`;

// アイテムリスト
const listsStyle = css`
    ${tw`p-3 border border-black`}
    width: 20%;
    /* min-height: 30rem; */
`;
const itemStyle = css`
    ${tw`px-2 py-1 mb-1 rounded bg-blue-500 text-white`}
`;

// ブロック
const blocksStyle = css`
    ${tw`p-4 mx-3 border-8 rounded-3xl border-black shadow-xl overflow-y-scroll bg-white`}
    width: 35%;
    height: 30rem;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;
const blockStyle = css`
    ${tw`relative p-3 mb-2 bg-gray-200`}
`;
const addBlockBtnStyle = css`
    ${tw`px-2 py-1 rounded bg-orange-300 text-white`}
    display: inline-block;
`;
const deleteBlockBtnStyle = css`
    ${tw`absolute p-1 rounded-full bg-red-300 leading-3 cursor-pointer`}
    top: -0.5rem;
    right: -0.5rem;
`;
// ブロックアイテム
const selectedItemStyle = css`
    ${itemStyle};
    ${tw`relative`}
`;
const moveItemBtnStyle = css`
    ${tw`absolute inset-y-auto left-2 rounded text-xl leading-5 text-white cursor-pointer`}
`;
const deleteItemBtnStyle = css`
    ${tw`absolute inset-y-auto right-2 rounded text-xl leading-5 text-white cursor-pointer`}
`;

export const DndSample: React.FC = () => {
    /**
     * 一意のID生成
     *
     * @returns string
     */
    const uuid = (): string => {
        return new Date().getTime().toString(16);
    };

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
    type Lists = List[];
    type Block = Item[];
    type Blocks = {
        [key: string]: Block;
    };

    // 初期ステート
    const initialLists: Lists = [
        {
            id: 'item1',
            title: 'アイテム１',
            items: [
                {
                    id: 'item1_1',
                    text: 'アイテム１ー１',
                },
                {
                    id: 'item1_2',
                    text: 'アイテム１－２',
                },
                {
                    id: 'item1_3',
                    text: 'アイテム１－３',
                },
            ],
        },
        {
            id: 'item2',
            title: 'アイテム２',
            items: [
                {
                    id: 'item2_1',
                    text: 'アイテム２ー１',
                },
                {
                    id: 'item2_2',
                    text: 'アイテム２－２',
                },
                {
                    id: 'item2_3',
                    text: 'アイテム２－３',
                },
            ],
        },
    ];
    const initialBlock: Block = [];
    const initialBlocks: Blocks = {
        [uuid()]: initialBlock,
    };

    /**
     * ステート
     */
    const [lists, setLists] = useState(initialLists);
    const [blocks, setBlocks] = useState(initialBlocks);

    /**
     * 並び替え処理
     *
     * @param lists
     * @param startIndex
     * @param endIndex
     * @return Block
     */
    const reorderItem = (
        lists: Block,
        startIndex: number,
        endIndex: number,
    ): Block => {
        const result = Array.from(lists);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    /**
     * コピー処理
     *
     * @param source
     * @param destination
     * @param droppableSource
     * @param droppableDestination
     * @returns Block
     */
    const copyItem = (
        source: Item[],
        destination: Block,
        droppableSource: DraggableLocation,
        droppableDestination: DraggableLocation,
    ): Block => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const item = sourceClone[droppableSource.index];

        destClone.splice(droppableDestination.index, 0, {
            ...item,
            id: uuid(),
        });

        return destClone;
    };

    /**
     * 移動処理
     *
     * @param source
     * @param destination
     * @param droppableSource
     * @param droppableDestination
     * @return { Block, Block }
     */
    const moveItem = (
        source: Block,
        destination: Block,
        droppableSource: DraggableLocation,
        droppableDestination: DraggableLocation,
    ) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
        destClone.splice(droppableDestination.index, 0, removed);

        const result = {
            [droppableSource.droppableId]: sourceClone,
            [droppableDestination.droppableId]: destClone,
        };

        return result;
    };

    /**
     * ドラッグエンドイベント
     */
    const handleOnDragEnd = useCallback(
        (result: DropResult) => {
            const { source, destination, draggableId } = result;

            if (!destination) {
                return;
            }

            switch (true) {
                // 並び替え
                case source.droppableId === destination.droppableId: {
                    console.log('並び替え');
                    setBlocks({
                        ...blocks,
                        [destination.droppableId]: reorderItem(
                            blocks[destination.droppableId],
                            source.index,
                            destination.index,
                        ),
                    });
                    break;
                }
                // コピー
                case source.droppableId.indexOf('items') != -1: {
                    console.log('コピー');
                    // const listIndex = lists.findIndex((list) => {
                    //   const itemIndex = list.items.findIndex((item) => {
                    //     return item.id === draggableId;
                    //   });
                    //   return itemIndex !== -1;
                    // });
                    const listIndex = Number(
                        source.droppableId.replace('items', ''),
                    );
                    setBlocks({
                        ...blocks,
                        [destination.droppableId]: copyItem(
                            lists[listIndex].items,
                            blocks[destination.droppableId],
                            source,
                            destination,
                        ),
                    });
                    break;
                }
                // 移動
                default: {
                    console.log('移動');
                    setBlocks({
                        ...blocks,
                        ...moveItem(
                            blocks[source.droppableId],
                            blocks[destination.droppableId],
                            source,
                            destination,
                        ),
                    });
                    break;
                }
            }
        },
        [blocks],
    );

    /**
     * アイテム削除
     */
    const deleteItem = useCallback(
        (blockId: string, deleteItemId: string) => {
            const block = blocks[blockId];
            const deleteIndex = block.findIndex(
                (block) => block.id === deleteItemId,
            );

            const result = Array.from(block);
            result.splice(deleteIndex, 1);

            setBlocks({ ...blocks, [blockId]: result });
        },
        [blocks],
    );

    /**
     * ブロック追加
     */
    const addBlock = useCallback(() => {
        setBlocks({ ...blocks, [uuid()]: [] });
    }, [blocks]);

    /**
     * ブロック削除
     */
    const deleteBlock = useCallback(
        (deleteBlockId: string) => {
            const result = { ...blocks };
            delete result[deleteBlockId];

            setBlocks(result);
        },
        [blocks],
    );

    return (
        <>
            <div css={dragDropContext}>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    {/* リスト */}
                    <div css={listsStyle}>
                        {lists.map((list, listIndex) => {
                            return (
                                <ListComponent
                                    key={list.id}
                                    list={list}
                                    listIndex={listIndex}
                                />
                            );
                        })}
                    </div>
                    {/* ブロック */}
                    <div css={blocksStyle}>
                        {Object.keys(blocks).map((blockId) => {
                            return (
                                <Droppable key={blockId} droppableId={blockId}>
                                    {(provided, snapshot) => (
                                        <div
                                            css={blockStyle}
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            // isDraggingOver={snapshot.isDraggingOver}
                                        >
                                            <span
                                                css={deleteBlockBtnStyle}
                                                onClick={() =>
                                                    deleteBlock(blockId)
                                                }
                                            >
                                                ×
                                            </span>
                                            {blocks[blockId].map(
                                                (selectedItem, index) => {
                                                    return (
                                                        <Draggable
                                                            key={
                                                                selectedItem.id
                                                            }
                                                            draggableId={
                                                                selectedItem.id
                                                            }
                                                            index={index}
                                                        >
                                                            {(
                                                                provided,
                                                                snapshot,
                                                            ) => (
                                                                <div
                                                                    css={
                                                                        selectedItemStyle
                                                                    }
                                                                    ref={
                                                                        provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    // isDraggin={snapshot.isDragging}
                                                                >
                                                                    <span
                                                                        css={
                                                                            moveItemBtnStyle
                                                                        }
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        ー
                                                                    </span>
                                                                    {
                                                                        selectedItem.text
                                                                    }
                                                                    <span
                                                                        css={
                                                                            deleteItemBtnStyle
                                                                        }
                                                                        onClick={() =>
                                                                            deleteItem(
                                                                                blockId,
                                                                                selectedItem.id,
                                                                            )
                                                                        }
                                                                    >
                                                                        ×
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    );
                                                },
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            );
                        })}
                        <button css={addBlockBtnStyle} onClick={addBlock}>
                            ブロック追加
                        </button>
                    </div>
                </DragDropContext>
            </div>
        </>
    );
};
