def to_singular(name: str) -> str:
    words = name.strip().split()
    if words and len(words[-1]) > 3 and words[-1].lower().endswith("s"):
        words[-1] = words[-1][:-1]
    return " ".join(words)
