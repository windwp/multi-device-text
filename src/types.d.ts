declare module '@use-hook/use-cookie'
{
    export function useCookie(key: string, value: string): any;

}


declare module 'react-copy-to-clipboard'
{
    declare class CopyToClipboard extends React.Component<{ text: string, onCopy: any}, {}> {

    }

}