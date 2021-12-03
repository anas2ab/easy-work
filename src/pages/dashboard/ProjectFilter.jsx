import React from "react";

const filterList = ['all', 'mine', 'development', 'design', 'marketing', 'sales'];

export default function ProjectFilter({ currentFilter, changeFilter }) {
    

    const handleClick = (filter) => {
        changeFilter(filter);
    }

    return (
        <div className="project-filter">
            <nav>
                <p>filter by:</p>
                {filterList.map((filter) => (
                    <button 
                        className={currentFilter === filter ? 'active' : ''}
                        key={filter}
                        onClick={() => handleClick(filter)}
                    >
                        {filter}
                    </button>
                ))}
            </nav>
        </div>
    )
}
