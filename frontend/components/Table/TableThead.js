export default function TableThead({ headers, theadClass = "px-6 py-4" }) {
    return (

        <tr>
            {headers.map((item, index) => (
                <th key={index} scope="col" className={`border border-secondary ${theadClass}`}>
                    {item.label}
                </th>
            ))}
        </tr>

    );
}
