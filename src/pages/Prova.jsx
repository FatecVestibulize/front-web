import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import apiVestibulizeClient, { traitExpiredToken } from "../utils/apiVestibulizeClient";
import InputTextArea from "../components/InputTextArea";
import Navbar from "../components/Navbar";

const Prova = () => {
    const navigate = useNavigate();
    const toast = useRef(null);

    const [filtro, setFiltro] = useState("");
    const [provas, setProvas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProva, setEditingProva] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingProva, setViewingProva] = useState(null);

    useEffect(() => {
        getProvas();
    }, []);

    const getProvas = async () => {
        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};

        const response = await apiVestibulizeClient
            .get("exam", {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
                params: params,
            })
            .catch((error) => {
                console.log(error.response.data.message);
                traitExpiredToken(error.response.data.message);
            });

        if (response?.data) {
            setProvas(
                response.data.map((item) => ({
                    data: item.date ? new Date(item.date).toLocaleDateString("pt-BR") : null,
                    titulo: item.name,
                    descricao: item.description,
                    id: item.id,
                }))
            );
        }
    };

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingProva(item);
        setTitulo(item ? item.titulo : "");
        setData(item ? item.data : "");
        setDescricao(item ? item.descricao : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProva(null);
        setTitulo("");
        setData("");
        setDescricao("");
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingProva(null);
    };

    const handleSave = async () => {
        if (!titulo.trim()) {
            toast.current?.show({
                severity: "warn",
                summary: "Aviso",
                detail: "O título é obrigatório!",
                life: 3000,
            });
            return;
        }

        const dados = {
            id: editingProva ? editingProva.id : null,
            name: titulo,
            date: data ? data + "T00:00:00" : null,
            description: descricao,
        };

        const request = editingProva
            ? apiVestibulizeClient.put("exam/" + dados.id, dados, {
                  headers: { token: `${localStorage.getItem("token")}` },
              })
            : apiVestibulizeClient.post("exam", dados, {
                  headers: { token: `${localStorage.getItem("token")}` },
              });

        request
            .then(() => {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: editingProva
                        ? "Prova atualizada com sucesso!"
                        : "Prova criada com sucesso!",
                    life: 3000,
                });
                getProvas();
            })
            .catch((error) => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: editingProva
                        ? "Erro ao atualizar prova. Tente novamente."
                        : "Erro ao criar prova. Tente novamente.",
                    life: 3000,
                });
            })
            .finally(() => handleCloseModal());
    };

    const acceptDelete = (id) => {
        apiVestibulizeClient
            .delete("exam/" + id, {
                headers: {
                    token: `${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Prova excluída com sucesso!",
                    life: 3000,
                });
                getProvas();
            })
            .catch((error) => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Erro ao excluir prova. Tente novamente.",
                    life: 3000,
                });
            });
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: "Tem certeza que deseja excluir esta prova?",
            header: "Confirmação de Exclusão",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Sim, excluir",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-success p-button-text",
            rejectClassName: "p-button-danger p-button-text",
            accept: () => acceptDelete(id),
        });
    };

    const formStyles = {
        input: {
            width: "100%",
            borderRadius: "8px",
            backgroundColor: "#2e2e42",
            border: "1px solid #4a4a60",
            color: "#e0e0e0",
            padding: "12px 15px",
        },
        button: {
            width: "100%",
            padding: "12px 0",
            borderRadius: "8px",
            backgroundColor: "#46397d",
            border: "none",
            color: "#e0e0e0",
            marginTop: "15px",
            fontWeight: "bold",
            letterSpacing: "1px",
        },
    };

    const modalFormJSX = (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSave();
            }}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="titulo" style={{ fontSize: "0.9em", color: "#c0c0c0" }}>
                    Título da Prova
                </label>
                <InputText
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={formStyles.input}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="data" style={{ fontSize: "0.9em", color: "#c0c0c0" }}>
                    Data da Prova
                </label>
                <InputText
                    id="data"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    style={formStyles.input}
                />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label htmlFor="descricao" style={{ fontSize: "0.9em", color: "#c0c0c0" }}>
                    Descrição
                </label>
                <InputTextArea
                    id="descricao"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    style={formStyles.input}
                />
            </div>

            <Button label={editingProva ? "ATUALIZAR" : "ADICIONAR"} style={formStyles.button} />
        </form>
    );

    const createCardActionsGenerator = (prova) => (
        <>
            <Button
                icon="pi pi-pencil"
                className="p-button-text p-button-sm"
                style={{ color: "#ffbc3fff" }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(prova);
                }}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-text p-button-sm"
                style={{ color: "#e05a2eff" }}
                onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(prova.id);
                }}
            />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);
        if (e.target.value.length > 3) getProvas();
    };

    return (
        <main
            style={{
                paddingTop: "55px",
                background: "linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)",
                minHeight: "100vh",
                width: "100%",
            }}
        >
            <Navbar />
            <Toast ref={toast} position="bottom-right" />
            <ConfirmDialog />

            <Header
                title="Datas de Prova"
                searchText={filtro}
                onSearchChange={handleFilterSearch}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel="Adicionar Prova"
            />

            <section
                style={{
                    padding: "0 20px",
                    maxWidth: "1000px",
                    margin: "30px auto",
                }}
            >
                <Listagem
                    listagem={provas}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                />
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProva ? "Atualizar - Prova" : "Adicionar - Prova"}
            >
                {modalFormJSX}
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                title={
                    viewingProva
                        ? `Visualizar - ${viewingProva.titulo}`
                        : "Visualizar Prova"
                }
            ></Modal>
        </main>
    );
};

export default Prova;
