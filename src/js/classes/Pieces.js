import { api } from "../app.js";

class Pieces {
    constructor({ selectedPieces, selectedGroup, callback }) {
        this.selectedPieces = selectedPieces ? selectedPieces : [];
        this.selectedGroup = selectedGroup ? selectedGroup : null;

        this.callback = callback;

        this.pieces = [];
        this.groups = [];

        this.lines = [
            {
                class: "top",
            },
            {
                class: "bottom",
            },
            {
                class: "left",
            },
            {
                class: "right",
            },
        ];
    }

    async init() {
        await Promise.all([this.readAllPieces(), this.readAllGroups()]);

        this.piecesEl = this.createPieces();
    }

    repaint() {
        this.piecesEl = this.createPieces();
    }

    setPieces(pieces) {
        this.pieces = pieces;
    }

    setGroups(groups) {
        this.groups = groups;
    }

    getPiecesEl() {
        return this.piecesEl;
    }

    getSelectedPieces() {
        return this.selectedPieces;
    }

    getSelectedGroup() {
        return this.selectedGroup;
    }

    async readAllPieces() {
        const response = await api.get("/api/admin/pieces");

        if (response.status === "error") {
            return;
        }
        this.setPieces(response.pieces);
    }

    async readAllGroups() {
        const response = await api.get("/api/admin/groups");

        if (response.status === "error") {
            return;
        }
        this.setGroups(response.groups);
    }

    createPieces() {
        const pieces = document.createElement("div");
        pieces.classList.add("pieces");

        this.pieces.forEach((piece) => {
            const pieceButton = document.createElement("button");
            pieceButton.classList.add("piece", piece.class);

            this.selectedPieces.forEach((selectedPiece) => {
                if (selectedPiece.id === piece.id) {
                    pieceButton.classList.add("active");
                }
            });

            pieceButton.addEventListener("click", () => {
                if (this.selectedGroup) {
                    this.selectedPieces = [];
                    this.selectedGroup = null;
                }

                const exists = this.selectedPieces.some((selectedPiece) => {
                    return selectedPiece.id === piece.id;
                });

                if (exists) {
                    this.selectedPieces = this.selectedPieces
                        .filter((selectedPiece) => {
                            return selectedPiece.id !== piece.id;
                        })
                        .sort();
                } else {
                    this.selectedPieces = [...this.selectedPieces, piece].sort();
                }

                this.repaint();
                this.callback();
            });

            pieces.appendChild(pieceButton);

            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("viewBox", `0 0 ${piece.width} ${piece.height}`);
            svg.setAttribute("width", piece.width);
            svg.setAttribute("height", piece.height);
            svg.setAttribute("fill", "currentColor");
            pieceButton.appendChild(svg);

            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("transform", `translate(0, ${piece.height}) scale(0.1, -0.1)`);
            svg.appendChild(g);

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", piece.d);
            g.appendChild(path);

            const span = document.createElement("span");
            span.innerText = piece.number;
            pieceButton.appendChild(span);
        });

        this.groups.forEach((group) => {
            const buttonEl = document.createElement("button");
            buttonEl.classList.add("group", group.class);

            if (this.selectedGroup && this.selectedGroup.id === group.id) {
                buttonEl.classList.add("active");
            }

            buttonEl.textContent = group.name;

            buttonEl.addEventListener("click", () => {
                this.selectedPieces = [];

                this.pieces.forEach((piece) => {
                    if (
                        (piece.number >= group.adult.from && piece.number <= group.adult.to) ||
                        (piece.number >= group.child.from && piece.number <= group.child.to)
                    ) {
                        this.selectedPieces = [...this.selectedPieces, piece].sort();
                    }
                });

                this.selectedGroup = group;
                buttonEl.classList.add("active");

                this.repaint();
                this.callback();
            });
            pieces.appendChild(buttonEl);
        });

        this.lines.forEach((line) => {
            const lineEl = document.createElement("div");
            lineEl.classList.add("line", line.class);
            pieces.appendChild(lineEl);
        });

        return pieces;
    }
}

export default Pieces;
