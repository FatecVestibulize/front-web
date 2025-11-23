import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate, useParams } from 'react-router-dom'; 
import apiVestibulizeClient, { traitExpiredToken } from "../utils/apiVestibulizeClient";
import InputTextArea from "../components/InputTextArea";
import Navbar from "../components/Navbar";
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

const Anotacao = () => {
    const navigate = useNavigate();
    const toast = useRef(null);
    const { notebook_id } = useParams();

    const [filtro, setFiltro] = useState("");
    const [anotacoes, setAnotacoes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnotacao, setEditingAnotacao] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [anotacao, setAnotacao] = useState("");
    const [pergunta, setPergunta] = useState("");
    const [sumario, setSumario] = useState("");

    const [resumoPagina, setResumoPagina] = useState("");

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingAnotacao, setViewingAnotacao] = useState(null);
    const [loadingResumo, setLoadingResumo] = useState(false);

    const AIButton = (
        <Button
            type="button"
            label={loadingResumo ? "Gerando resumo..." : "Gerar resumo com IA"}
            icon={loadingResumo ? "pi pi-spin pi-spinner" : "pi pi-sparkles"}
            disabled={loadingResumo}
            onClick={() => handleGerarResumo()}
            style={{
                marginTop: "10px",
                width: "100%",
                background: "#6a4cff",
                border: "none",
                color: "white",
                borderRadius: "8px",
                padding: "15px",
                fontWeight: "100",
            }}
        />
    );

    useEffect(() => {
        getAnotacoes();
    }, []);

    const getAnotacoes = async () => {
        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};
        try {
            const response = await apiVestibulizeClient.get(`notebook/${notebook_id}/notes`, { 
                headers: { token: `${localStorage.getItem('token')}` },
                params: params
            });

            if (response?.data) {
                setAnotacoes(response.data.map((item) => ({
                    data: item.created_at === null ? null : new Date(item.created_at).toLocaleDateString("pt-BR"),
                    titulo: item.title,
                    anotacao: item.content,
                    pergunta: item.questions,
                    sumario: item.summary,
                    id: item.id
                })));
            }
        } catch (error) {
            console.error("Erro ao buscar anotações:", error);
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao buscar anotações.', life: 3000 });
        }
    };

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingAnotacao(item);
        setTitulo(item ? item.titulo : "");
        setAnotacao(item ? item.anotacao : "");
        setPergunta(item ? item.pergunta : "");
        setSumario(item ? item.sumario : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAnotacao(null);
        setTitulo("");
        setAnotacao("");
        setPergunta("");
        setSumario("");
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingAnotacao(null);
    };

    const handleSave = async () => {
        if (!titulo.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'O título é obrigatório!', life: 3000 });
            return;
        }
        const dados = {
            id: editingAnotacao ? editingAnotacao.id : null,
            title: titulo,
            notebook_id: notebook_id,
            content: anotacao,
            questions: pergunta,
            summary: sumario,
        };

        if (editingAnotacao) {
            apiVestibulizeClient.put('note/' + dados.id, dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Anotação atualizada com sucesso!', life: 3000 });
                getAnotacoes();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar anotação.', life: 3000 });
            }).finally(() => handleCloseModal());
        } else {
            apiVestibulizeClient.post('note', dados, { headers: {
                token: `${localStorage.getItem('token')}` 
            }}).then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Anotação criada com sucesso!', life: 3000 });
                getAnotacoes();
            }).catch(error => {
                console.error(error);
                traitExpiredToken(error.response.data.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar anotação.', life: 3000 });
            }).finally(() => handleCloseModal());
        }
    };

    const confirmDelete = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta anotação?',
            header: 'Confirmar exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-text p-button-success',
            rejectClassName: 'p-button-text p-button-danger',
            acceptLabel: 'Sim, excluir',
            rejectLabel: 'Cancelar',
            accept: () => {
                apiVestibulizeClient.delete('note/' + id, { headers: {
                    token: `${localStorage.getItem('token')}` 
                }}).then(() => {
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Anotação excluída com sucesso!', life: 3000 });
                    getAnotacoes();
                }).catch(error => {
                    console.error(error);
                    traitExpiredToken(error.response.data.message);
                    toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir anotação.', life: 3000 });
                });
            }
        });
    };

    const formStyles = {
        input: {
            width: '100%',
            borderRadius: '8px',
            backgroundColor: '#2e2e42',
            border: '1px solid #4a4a60',
            color: '#e0e0e0',
            padding: '12px 15px',
        },
        button: {
            width: '100%',
            padding: '12px 0',
            borderRadius: '8px',
            backgroundColor: '#46397d',
            border: 'none',
            color: '#e0e0e0',
            marginTop: '15px',
            fontWeight: 'bold',
            letterSpacing: '1px',
        },
    };

    const iconStyle = {
        marginLeft: '8px',
        color: '#977acfff',
        cursor: 'help',
        fontSize: '0.7em',
    };

    const handleGerarResumo = async () => {
        try {
            setLoadingResumo(true);

            const resumoGerado = await apiVestibulizeClient.post(
                `notebook/${notebook_id}/resumir`,
                { content: anotacao },
                { headers: { token: `${localStorage.getItem('token')}` } }
            );

            const textoResumo = resumoGerado?.data || "";

            setSumario(textoResumo);

            setResumoPagina(textoResumo);

            toast.current?.show({
                severity: "success",
                summary: "Resumo gerado!",
                detail: "O resumo foi exibido na tela principal.",
                life: 3000
            });

        } catch (err) {
            console.error("Erro ao gerar resumo:", err);
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Não foi possível gerar o resumo.",
                life: 3000
            });
        } finally {
            setLoadingResumo(false);
        }
    };

    const modalFormJSX = (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título</label>
                    <i id="tooltip-icon-titulo" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip target="#tooltip-icon-titulo" content="Seção para o nome do curso, tema, data, etc." position="top" />
                </div>
                <InputText id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} style={formStyles.input} autoFocus />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="anotacao" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Anotação</label>
                    <i id="tooltip-icon-anotacao" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip target="#tooltip-icon-anotacao" content="Seção para as anotações com conceitos e ideias principais." position="top" />
                </div>
                <InputTextArea id="anotacao" value={anotacao} onChange={(e) => setAnotacao(e.target.value)} style={formStyles.input} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="pergunta" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Perguntas</label>
                    <i id="tooltip-icon-pergunta" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip target="#tooltip-icon-pergunta" content="Seção para revisão destinada a palavras-chave para lembrar do conteúdo." position="top" />
                </div>
                <InputText id="pergunta" value={pergunta} onChange={(e) => setPergunta(e.target.value)} style={formStyles.input} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="sumario" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Sumário</label>
                    <i id="tooltip-icon-sumario" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip target="#tooltip-icon-sumario" content="Seção para resumir o que foi entendido sobre o conteúdo." position="top" />
                </div>
                <InputText id="sumario" value={sumario} onChange={(e) => setSumario(e.target.value)} style={formStyles.input} />
            </div>

            <Button label={editingAnotacao ? "ATUALIZAR" : "ADICIONAR"} style={formStyles.button} />
        </form>
    );

    const createCardActionsGenerator = (anotacao) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" style={{ color: '#ffbc3fff' }} onClick={(e) => { e.stopPropagation(); handleOpenModal(anotacao); }} />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm" style={{ color: '#e05a2eff' }} onClick={(e) => { e.stopPropagation(); confirmDelete(anotacao.id); }} />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);
        if (e.target.value.length > 3) getAnotacoes();
    };


    return (
        <main style={{ paddingTop: '55px', background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Navbar />
            <Toast ref={toast} position="bottom-right" />
            <ConfirmDialog />

            <Header
                title="Anotações"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel="Adicionar Anotação"
                customButton={AIButton}
                backButton={true}
            />

            {resumoPagina && (
            <section
                style={{
                    maxWidth: "1000px",
                    margin: "25px auto",
                    padding: "0 20px"
                }}
            >
            <div
                style={{
                    width: "100%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0px 4px 14px rgba(0,0,0,0.15)",
                    fontFamily: "inherit",
                    background: "white"
                }}
        >
            <div
                style={{
                    background: "#6A4CFF",
                    color: "white",
                    padding: "18px 22px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    fontFamily: "inherit"
                }}
            >
                <span style={{ fontSize: "1.4rem"}}> <i className="pi pi-sparkles"/></span>
                <span>Resumo Gerado pela IA</span>
            </div>

            <div style={{ padding: "18px 22px", background: "white" }}>
                <textarea
                    readOnly
                    value={resumoPagina}
                    style={{
                        width: "100%",
                        minHeight: "140px",
                        resize: "vertical",
                        borderRadius: "10px",
                        border: "1px solid #E0E0E0",
                        padding: "14px 16px",
                        outline: "none",
                        background: "#FAFAFA",
                        color: "#333",
                        fontFamily: "inherit",
                        fontSize: "0.95rem",
                        lineHeight: "1.48",
                    }}
                />
            </div>
        </div>
    </section>
)}


            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={anotacoes}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                />
            </section>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAnotacao ? "Atualizar - Anotação" : "Adicionar - Anotação"}>
                {modalFormJSX}
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={handleCloseViewModal} title={viewingAnotacao ? `Visualizar - ${viewingAnotacao.titulo}` : "Visualizar Anotação"}>
            </Modal>
        </main>
    );
};

export default Anotacao;

