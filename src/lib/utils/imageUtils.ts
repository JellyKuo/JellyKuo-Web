

function getImageImport(src: string) : Promise<ImageMetadata> | undefined {
    src = `/public${src}`;

    // Glob pattern to load images from the /public/images folder
    const images = import.meta.glob("/public/images/**/*.{jpeg,jpg,png,gif,svg}");

    if (!images[src]) {
        return undefined;
    }

    return (images[src]() as Promise<{ default: ImageMetadata }>).then(module => module.default);
}

export { getImageImport };