import {SvgIcon} from "@mui/material";

export default function ChatIcon() {
    return <SvgIcon>
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 512 512"
             height={512}
             width={512}
             style={{transform: "scale(1.5)"}}
        >
            <path d="M0 0h512v512H0z" fill="#000" fillOpacity="0"/>
            <g className="" transform="translate(0,0)">
                <path d="M488 348.78h-70.24l-15.1 87.44-48.78-87.44H169v-50h190v-157h129zm-145-273v207H158.13l-48.79 87.47-15.11-87.47H24v-207zM136.724 215.324c0-10.139-12.257-15.214-19.425-8.046-7.168 7.168-2.093 19.426 8.046 19.426 6.285 0 11.38-5.095 11.38-11.38zm60.945 0c-.068-10.12-12.32-15.122-19.452-7.943-7.131 7.18-2.047 19.399 8.073 19.399 6.314 0 11.422-5.141 11.38-11.456zm60.945 0c0-10.139-12.257-15.214-19.425-8.046-7.169 7.168-2.093 19.426 8.046 19.426 6.284 0 11.38-5.095 11.38-11.38z"
                      fill="currentColor" fillOpacity="1"/>
            </g>
        </svg>
    </SvgIcon>
}
