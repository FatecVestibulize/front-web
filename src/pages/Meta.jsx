import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tooltip } from 'primereact/tooltip'; 
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Header from "../components/Header";
import Listagem from "../components/Listagem";
import Modal from "../components/Modal";
import { useNavigate } from 'react-router-dom'; 
import apiVestibulizeClient, { traitExpiredToken } from "../utils/apiVestibulizeClient";
import Navbar from "../components/Navbar";

const Meta = () => {

    const navigate = useNavigate();
    const toast = useRef(null);

    const [filtro, setFiltro] = useState("");
    const [metas, setMetas] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMeta, setEditingMeta] = useState(null);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [dataLimite, setDataLimite] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingMeta, setViewingMeta] = useState(null);

    useEffect(() => {
        getMetas();
    }, []);

    const getMetas = async () => {
        const params = filtro.trim().length > 3 ? { search: filtro.trim() } : {};

        const response = await apiVestibulizeClient.get('goal', { 
            headers: {
                token: `${localStorage.getItem('token')}` 
            },
            params: params
        }).catch(error => {
            console.log(error.response?.data?.message);
            traitExpiredToken(error.response?.data?.message);
        });
        
        if (response?.data) {
            setMetas(response.data.map((item) => ({
                data: item.created_at ? new Date(item.created_at).toLocaleDateString("pt-BR") : null,
                titulo: item.title,
                descricao: item.description,
                dataLimite: item.deadline,
                prioridade: item.priority,
                id: item.id
            })));
        }
    };

    const handleOpenModal = (item = null) => {
        setIsViewModalOpen(false);
        setEditingMeta(item);
        setTitulo(item ? item.titulo : "");
        setDescricao(item ? item.descricao : "");
        setDataLimite(item ? item.dataLimite : "");
        setPrioridade(item ? item.prioridade : "");
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMeta(null);
        setTitulo("");
        setDescricao("");
        setDataLimite("");
        setPrioridade("");
    };
    
    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setViewingMeta(null);
    };

    const handleSave = async () => {
        if (!titulo.trim()) {
            toast.current?.show({ severity: 'warn', summary: 'Aviso', detail: 'O título é obrigatório!', life: 3000 });
            return;
        }

        const dados = {
            id: editingMeta ? editingMeta.id : null,
            title: titulo,
        };

        if (editingMeta) {
            apiVestibulizeClient.put('goal/' + dados.id, dados, { 
                headers: { token: `${localStorage.getItem('token')}` } 
            })
            .then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Meta atualizada com sucesso!', life: 3000 });
                getMetas();
            })
            .catch(error => {
                console.error(error);
                traitExpiredToken(error.response?.data?.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao atualizar meta. Tente novamente.', life: 3000 });
            })
            .finally(() => handleCloseModal());
        } else {
            apiVestibulizeClient.post('goal', dados, { 
                headers: { token: `${localStorage.getItem('token')}` } 
            })
            .then(() => {
                toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Meta criada com sucesso!', life: 3000 });
                getMetas();
            })
            .catch(error => {
                console.error(error);
                traitExpiredToken(error.response?.data?.message);
                toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao criar meta. Tente novamente.', life: 3000 });
            })
            .finally(() => handleCloseModal());
        }
    };

    const handleDelete = (id) => {
        confirmDialog({
            message: 'Tem certeza que deseja excluir esta meta?',
            header: 'Confirmação',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Não',
            acceptClassName: 'p-button-success p-button-text',
            rejectClassName: 'p-button-danger p-button-text',
            accept: () => {
                apiVestibulizeClient.delete('goal/' + id, { 
                    headers: { token: `${localStorage.getItem('token')}` } 
                })
                .then(() => {
                    toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Meta excluída com sucesso!', life: 3000 });
                    getMetas();
                })
                .catch(error => {
                    console.error(error);
                    toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Erro ao excluir meta. Tente novamente.', life: 3000 });
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

    const modalFormJSX = (
        <form
            onSubmit={(e) => { e.preventDefault(); handleSave(); }}
            style={{ display: "flex", flexDirection: "column" }}
        >
            <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                    <label htmlFor="titulo" style={{ fontSize: '0.9em', color: '#c0c0c0' }}>Título da Meta</label>
                    <i id="tooltip-icon-titulo" className="pi pi-info-circle" style={iconStyle} />
                    <Tooltip 
                        target="#tooltip-icon-titulo" 
                        content="Digite um título claro e objetivo para sua meta." 
                        position="top" 
                    />
                </div>
                <InputText
                    id="titulo"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    style={formStyles.input}
                    autoFocus
                />
            </div>

            <Button
                label={editingMeta ? "ATUALIZAR" : "ADICIONAR"}
                style={formStyles.button}
            />
        </form>
    );

    const viewModalJSX = viewingMeta && (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            color: '#e0e0e0'
        }}>
            <p style={{ margin: 0, fontSize: '1em', color: '#c0c0c0' }}>
                Data: {viewingMeta.data}
            </p>
            <div style={{ 
                backgroundColor: '#2e2e42', 
                borderRadius: '8px', 
                padding: '15px', 
                border: '1px solid #4a4a60',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
            }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Descrição:</p>
                <p style={{ margin: '0 0 15px 0' }}>{viewingMeta.descricao}</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Data Limite:</p>
                <p style={{ margin: '0 0 15px 0' }}>{viewingMeta.dataLimite}</p>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Prioridade:</p>
                <p style={{ margin: '0' }}>{viewingMeta.prioridade}</p>
            </div>
        </div>
    );

    const createCardActionsGenerator = (meta) => (
        <>
            <Button 
                icon="pi pi-pencil" 
                className="p-button-text p-button-sm" 
                style={{ color: '#ffbc3fff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleOpenModal(meta); 
                }} 
            />
            <Button 
                icon="pi pi-trash" 
                className="p-button-text p-button-sm" 
                style={{ color: '#e05a2eff' }} 
                onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDelete(meta.id); 
                }} 
            />
        </>
    );

    const handleFilterSearch = (e) => {
        setFiltro(e.target.value);
        if (e.target.value.length > 3) {
            getMetas();
        }
    };

    return (
        <main style={{paddingTop: '55px', background: 'linear-gradient(180deg, #F9F9F9 0%, #E6E9F0 100%)', minHeight: '100vh', width: '100%' }}>
            <Navbar />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          pointerEvents: "none",
          backgroundColor: "#E8E8E8",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-100px",
            width: "400px",
            height: "350px",
            backgroundColor: "#D6D1EB",
            borderRadius: "50%",
            opacity: "0.6",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            bottom: "-140px",
            left: "-120px",
            width: "300px",
            height: "300px",
            backgroundColor: "#D6D1EB",
            borderRadius: "50%",
            opacity: "0.5",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "10%",
            width: "120px",
            height: "120px",
            backgroundColor: "#CBC5E3",
            borderRadius: "50%",
            opacity: "0.4",
          }}
        ></div>

        <div
          style={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: "120px",
            height: "120px",
            backgroundColor: "#DCD7F0",
            borderRadius: "50%",
            opacity: "0.3",
            transform: "rotate(-25deg)",
          }}
        ></div>
      </div>

            <Toast ref={toast} position="bottom-right"/>
            <ConfirmDialog />

            <Header
                title="Metas"
                searchText={filtro}
                onSearchChange={(e) => handleFilterSearch(e)}
                onAddClick={() => handleOpenModal()}
                searchPlaceholder="Pesquisar por título."
                addButtonLabel= "Adicionar Meta"
            />

            <section style={{ padding: "0 20px", maxWidth: "1000px", margin: "30px auto" }}>
                <Listagem
                    listagem={metas}
                    headerTitle="Título/Data"
                    headerActions="Ações"
                    cardActionsGenerator={createCardActionsGenerator}
                />
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMeta ? "Atualizar - Meta" : "Adicionar - Meta"}
            >
                {modalFormJSX}
            </Modal>

            <Modal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                title={viewingMeta ? `Visualizar - ${viewingMeta.titulo}` : "Visualizar Meta"}
            >
                {viewModalJSX}
            </Modal>

        </main>
    );
};

export default Meta;
