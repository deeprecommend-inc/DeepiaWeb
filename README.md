# DeepiaClient

Component

```tsx
type Props = {
    id: number;
    name: string;
};

export const component = (props: Props) => {
    /**
     * Constants
     */
    const [constants, setConstants] = useState();

    /**
     * Life circle hook
     */
    useEffect(() => {
        const init = async () => {
            console.log('Init');
        };

        init();
    }, []);

    const eventFn = () => {};

    const asyncFn = async () => {};

    const element = {
        return (
            <>
                <div id=element></div>
            </>
        )
    }

    return (
        <>
            <div id="element">{element}</div>
        </>
    );
};
```

## Reference

- Desktop app by electron
  before install
  `sh $ sudo dpkg --add-architecture i386 && sudo apt-get update && sudo apt-get install wine32 `

  - https://qiita.com/NozomuTsuruta/items/bb023a6f5bf6be3b3217

  - https://towardsdatascience.com/uploading-large-files-to-github-dbef518fa1a

  - https://towardsdatascience.com/uploading-large-files-to-github-dbef518fa1a

# DeepiaWeb
