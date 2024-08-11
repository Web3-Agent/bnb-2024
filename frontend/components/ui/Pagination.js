import React from 'react'

export default function Pagination({ pagination: { page, totalPages, pageSize }, setPagination, onClick }) {
    const pageArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    const onNextPageClick = () => {
        if (page < (totalPages - 1)) {
            setPagination({ totalPages, pageSize, page: page + 1 });
            onClick(page + 1);
        }
    }
    const onPreviousPageClick = () => {
        if (page > 0) {
            onClick(page - 1);
        }
    }
    const onPageClick = (value) => {
        if (value !== page) {
            onClick(value);
        }
    }
    return (
        <><nav aria-label="Page navigation example">
            <ul class="pagination pagination-lg justify-content-center mb-2">
                <li class="page-item">
                    <div class={`page-link  ${(page + 1) === 1 ? 'bg-secondary disabled-cursor text-black' : 'bg-dark pointer-cursor text-light'}`}
                        onClick={() => onPreviousPageClick()}>
                        <span aria-hidden="true">&laquo;</span>
                    </div>
                </li>
                {pageArray.map((item, index) => (
                    <li class="page-item" onClick={() => onPageClick(item - 1)}>
                        <span class={`page-link pointer-cursor  ${(page + 1) === item ? 'bg-info-subtle text-dark' : 'bg-dark text-light'} `} href="#">{item}</span>
                    </li>

                ))}
                <li class="page-item">
                    <div class={`page-link ${(page + 1) === totalPages ? 'bg-secondary text-black disabled-cursor ' : 'bg-dark pointer-cursor text-light'}`}
                        onClick={() => onNextPageClick()}>
                        <span aria-hidden="true">&raquo;</span>
                    </div>
                </li>
            </ul>
        </nav>
        </>

    )
}
