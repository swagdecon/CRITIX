import React from "react"
import AddIcon from '@mui/icons-material/Add';
export default function WatchListBtn() {
    return (
        <div class="center">
            <div class="btn-container">
                <div class='btn'>
                    <div class='add-icon'>
                        <AddIcon />
                    </div>
                    <div class='watchlist-label'>
                        <span>Add to Watchlist</span>
                    </div>
                </div>
            </div>
        </div>
    )
}