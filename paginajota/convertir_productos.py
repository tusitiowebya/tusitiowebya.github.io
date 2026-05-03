import json

INPUT_FILE = "backup.json"
OUTPUT_FILE = "productos.json"


def transformar_producto(p, index):
    return {
        "id": index + 1,
        "nombre": p.get("name", "Sin nombre"),
        "precio": p.get("price", 0),
        "imagen": p.get("image", "img/default.jpg"),
        "categoria": p.get("category", "general"),
        "codigo": p.get("code", ""),
        "stock": not p.get("noStock", False)
    }


def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Si viene como lista directamente
    if isinstance(data, list):
        productos_raw = data
    else:
        productos_raw = [data]

    productos = [
        transformar_producto(p, i)
        for i, p in enumerate(productos_raw)
    ]

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(productos, f, indent=2, ensure_ascii=False)

    print(f"✅ {len(productos)} productos convertidos correctamente")


if __name__ == "__main__":
    main()