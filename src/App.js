import { useState } from 'react';
import './App.css';

const DEFAULT_COLUMNS = ['Backlog', 'In Progress', 'Done'];

function Item({ uuid, children }) {

  const itemStyle = {
    backgroundColor: '#B3AA00',
    marginTop: "5px",
    marginBottom: "5px",
    borderRadius: "5px",
    padding: "2px",
    color: "white",
    minHeight: "50px",
    cursor: "grab"
  }

  return <div data-uuid={uuid} style={itemStyle} draggable={true}>
    {children}
  </div>
}

function Column({ colName, colWidth, items, addItemHandler, moveItemHandler, dropItemHandler }) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemContent, setNewItemContent] = useState("");
  const [isItemHovering, setIsItemHovering] = useState(false);

  const addIcon = isAddingItem ? "bi-dash-circle-fill" : "bi-plus-circle-fill";

  const onDragEnter = evt => {
    setIsItemHovering(true);
    if (evt.target.getAttribute("data-uuid") !== null) {
      moveItemHandler(evt.target.getAttribute("data-uuid"));
    }
    evt.preventDefault();
    evt.stopPropagation();
  }

  const onDragOver = evt => {
    setIsItemHovering(true);
    evt.preventDefault();
    evt.stopPropagation();
  }

  const onDragLeave = evt => {
    setIsItemHovering(false);
    evt.preventDefault();
    evt.stopPropagation();
  }

  const onDrop = evt => {
    setIsItemHovering(false);
    dropItemHandler(colName);
    evt.preventDefault();
    evt.stopPropagation();
  }

  const onSubmit = (evt) => {
    evt.preventDefault();
    addItemHandler({
      uuid: crypto.randomUUID(),
      column: colName,
      content: newItemContent
    });
    setNewItemContent("");
    setIsAddingItem(false);
  }

  const columnStyle = {
    backgroundColor: 'white',
    borderRadius: '5px',
    padding: '10px',
    marginTop: '10px',
    minHeight: 'calc(100vh - 160px)',
    width: `${colWidth}px`,
    display: 'flex',
    flexDirection: 'column'
  }

  const headerStyle = {
    backgroundColor: '#8E4DFF',
    borderRadius: '5px',
    color: 'white',
    padding: '5px',
  }

  const newItemStyle = {
    backgroundColor: '#B3AA00',
    borderRadius: '5px',
    padding: '5px',
    marginTop: '5px'
  }

  const dropAreaStyle = {
    border: "1px dashed black",
    borderRadius: "5px",
    marginTop: "5px",
    minHeight: "50px",
    backgroundColor: "rgba(179, 170, 0, 0.5)",
  }
  
  return <section 
    style={columnStyle} 
    onDragEnter={evt => onDragEnter(evt)} 
    onDragLeave={evt => onDragLeave(evt)}
    onDragOver={evt => onDragOver(evt)}
    onDrop={evt => onDrop(evt)}>

    <header style={headerStyle}>
      {colName}
      <i 
        className={`${addIcon} float-end`} 
        style={{cursor: 'pointer'}} 
        onClick={() => setIsAddingItem(!isAddingItem)}
      />
    </header>

    {(isAddingItem && (
      <div style={newItemStyle}>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <div className='input-group mb-3'>
              <input 
                className='form-control' 
                placeholder='Type here to add an item' 
                value={newItemContent}
                onChange={(evt) => setNewItemContent(evt.target.value)} 
              />
            </div>
          </div>
        </form>
      </div>
    ))}

    {isItemHovering && <div style={dropAreaStyle} />}
    
    {items.map((item, i) => 
      <Item key={i} uuid={item.uuid}>{item.content}</Item> 
    )}
  </section>
}

function Board( { columns }) {
  const [items, setItems] = useState([]);
  const [movingItemUuid, setMovingItemUuid] = useState(null);

  const colWidth = (window.innerWidth / columns.length) - 10;

  const boardStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  }

  const moveItemColumn = (newCol) => {
    setItems(items.map(item => item.uuid === movingItemUuid ? {...item, column: newCol} : item));
  }

  return <main style={boardStyle}>
    {columns.map((column, i) => 
      <Column 
        key={i}
        colName={column} 
        colWidth={colWidth} 
        items={items.filter((item) => item.column === column)}
        addItemHandler={(newItem) => setItems([...items, newItem])}
        moveItemHandler={(uuid) => setMovingItemUuid(uuid)}
        dropItemHandler={moveItemColumn} 
      />
    )}
  </main>
}

function AddColumn( { columnHandler }) {
  const [newColName, setNewColName] = useState("");

  const addColumnStyle = {
    minHeight: '150px',
    paddingTop: '10px'
  }

  const onSubmit = (evt) => {
    evt.preventDefault();
    columnHandler(newColName); 
    setNewColName("");
  }

  return <footer style={addColumnStyle}>
    <form onSubmit={onSubmit}>
      <div className='form-group'>
        <div className='input-group mb-3'>
          <input 
            className='form-control' 
            placeholder='Type here to add a column' 
            value={newColName}
            onChange={(evt) => setNewColName(evt.target.value)} 
          />
          <div className="input-group-append">
            <button 
              className='btn btn-primary'
              type="submit">
            Add
            </button> 
          </div>
      </div>
      </div>
    </form>
  </footer>
}

function App() {
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);

  return <div className="container-fluid">
    <div className="rounded-container">
      <h3><i className='bi-kanban' /> React Kanban</h3>
    </div>
    <Board columns={columns} />
    <AddColumn 
      columnHandler={(newCol) => setColumns([...columns, newCol])} 
    />
  </div>
}

export default App;
